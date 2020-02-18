import { Request, Response } from 'express';

export const postSnapshots = async (req: Request, res: Response) => {
    console.log('POST /snapshots request:', JSON.stringify(req.body, null, 2));
    // TODO: persist to blob storage and DB
    const responseBody = { id: '12345', createdAt: new Date(), ...req.body,  };
    console.log('POST /snapshots response:', JSON.stringify(responseBody, null, 2));
    res.json(responseBody);
};
