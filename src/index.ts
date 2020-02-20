require('dotenv').config();

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { serializeError } from 'serialize-error';

import { ormConfig } from '../ormConfig';
import { AppRoutes } from './routes';
import { getSnapshotService } from './business/SnapshotService';

// Ideally the continuously running job would reside in a separate repository and run as a separate process.
// We would also use queues and make the job scalable. This is an oversimplified hackathon-quality implementation of a job runner.
import { JobRunner } from './jobs/JobRunner';

const PORT = process.env.PORT || 5000;

createConnection(ormConfig)
    .then(async connection => {
        // create and setup express app
        const app = express();

        app.use(bodyParser.json());
        app.use(cors());

        // register all application routes
        AppRoutes.forEach(route => {
            app[route.method](route.path, (req: Request, res: Response, next: Function) => {
                route
                    .action(req, res)
                    .then(() => next)
                    .catch(err => next(err));
            });
        });

        app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
        // error handler
        app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
            const status = (err as any).status || 500;
            res.status(status)
                .type('application/json')
                .send({
                    error: {
                        code: status,
                        innererror: serializeError(err),
                        message: err.message,
                    },
                });
            console.error(`Returned error ${status}: ${err.message}`);
        });

        (new JobRunner()).start();
    })
    .catch(error => console.log('TypeORM connection error', error));

