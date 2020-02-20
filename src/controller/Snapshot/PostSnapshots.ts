import { Request, Response } from 'express';
import { getSnapshotService } from '../../business/SnapshotService';
export const postSnapshots = async (req: Request, res: Response) => {
    console.log(`POST /${req.params.org}/${req.params.repo}/snapshots request:`, JSON.stringify(req.body, null, 2));
    const snapshotService = await getSnapshotService();
    const tags = req.body.metadata;
    const snapshotToCreate = {
        ...req.body,
        metadata: {
            ...req.params,
            metadata: Object.keys(tags).map((v: string) => { return {  ...req.params, key: v, value: tags[v] };})
        } 
    } 
    const createdSnapshot = await snapshotService.saveSnapshot(snapshotToCreate);
    console.log(`POST /${req.params.org}/${req.params.repo}/snapshots response:`, JSON.stringify(req.body, null, 2));
    res.json(createdSnapshot);
};
