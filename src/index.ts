require('dotenv').config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send('MSFT OSE Hackathon Server')
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))