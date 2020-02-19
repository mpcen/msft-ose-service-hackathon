import { Request, Response } from 'express';
import { getSnapshotService } from '../../business/SnapshotService';


export const postSnapshots = async (req: Request, res: Response) => {
    console.log(`POST /${req.params.org}/${req.params.repo}/snapshots request:`, JSON.stringify(req.body, null, 2));
    const snapshotService = await getSnapshotService();
    await snapshotService.saveSnapshot({
        ...req.body,
        metadata: {
            snapshotId: req.body.id,
            ...req.params,
            ...req.body.metadata,
        }
    });
    console.log(`POST /${req.params.org}/${req.params.repo}/snapshots response:`, JSON.stringify(req.body, null, 2));
    res.json(req.body);
};
