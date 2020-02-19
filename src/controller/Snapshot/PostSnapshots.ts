import { Request, Response } from 'express';

export const postSnapshots = async (req: Request, res: Response) => {
    console.log(`POST /${req.params.org}/${req.params.repo}/snapshots request:`, JSON.stringify(req.body, null, 2));
    // TODO: persist to blob storage and DB
    const responseBody = { id: '12345', createdAt: new Date(), org: req.params.org, repo: req.params.repo, ...req.body,  };
    console.log(`POST /${req.params.org}/${req.params.repo}/snapshots response:`, JSON.stringify(responseBody, null, 2));
    res.json(responseBody);
};
