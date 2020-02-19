import { Request, Response } from 'express';
import { getSnapshotService } from '../../business/SnapshotService';

export const getSnapshots = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/${req.params.id}:`, 'req.query.params:', req.query);
    const snapshotService = await getSnapshotService();
    const { org, repo, id } = req.params;
    const snapshot = await snapshotService.getById(org, repo, parseInt(id));
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/${req.params.id} response:`, JSON.stringify(snapshot, null, 2), 'req.query.params:', req.query);
    res.status(snapshot ? 200 : 404).json(snapshot);
};
