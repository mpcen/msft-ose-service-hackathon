import { Request, Response } from 'express';

export const getSnapshots = async (req: Request, res: Response) => {
    res.send({ message: 'hello from get snapshots' });
};
