require('dotenv').config();

import 'reflect-metadata';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createConnection } from 'typeorm';

import { ormConfig } from '../ormConfig';
import { AppRoutes } from './routes';

// Ideally the continuosly running job would reside in a separate repository and run as a separate process.
// We would also use queues and make the job scalable. This is an oversimplified hackathon-quality implementation of a job runner.
import { JobRunner } from './jobs/JobRunner';
(new JobRunner()).start();

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
    })
    .catch(error => console.log('TypeORM connection error', error));
