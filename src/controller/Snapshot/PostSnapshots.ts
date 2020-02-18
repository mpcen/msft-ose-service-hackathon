import { Request, Response } from 'express';

export const postSnapshots = async (req: Request, res: Response) => {
    res.send({ message: 'hello from post snapshots' });
};
