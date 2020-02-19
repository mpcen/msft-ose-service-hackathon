import { Request, Response } from 'express';
import { getSnapshotService } from '../../business/SnapshotService';

export const getSnapshots = async (req: Request, res: Response) => {
    const { org, repo, id } = req.params;
    const snapshotService = await getSnapshotService();
    const snapshot = await snapshotService.getById(org, repo, parseInt(id));

    res.status(snapshot ? 200 : 404).json(snapshot);
};
