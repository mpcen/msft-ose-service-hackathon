import { Request, Response } from 'express';
import { getSnapshotService } from '../../business/SnapshotService';


export const postSnapshots = async (req: Request, res: Response) => {
    const { id, metadata } = req.body;
    const snapshotService = await getSnapshotService();

    await snapshotService.saveSnapshot({
        ...req.body,
        metadata: {
            snapshotId: id,
            ...req.params,
            ...metadata,
        }
    });

    res.json(req.body);
};
