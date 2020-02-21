import { Request, Response } from 'express';
import { getSnapshotService } from '../../business/SnapshotService';

export const getSnapshotById = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/${req.params.id}:`);
    const snapshotService = await getSnapshotService();
    const { org, repo, id } = req.params;
    const snapshot = await snapshotService.getById(org, repo, parseInt(id));
    console.log(JSON.stringify(snapshot))
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/${req.params.id} response:`, JSON.stringify(snapshot, null, 2));
    res.status(snapshot ? 200 : 404).json(snapshot);
};

export const getLatestSnapshot = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/latest`, 'req.query.params:', req.query);
    const snapshotService = await getSnapshotService();
    const { org, repo } = req.params;
    const queries = Object.keys(req.query).map((k: string) => {return { key: k, value: req.query[k]};})
    const snapshot = await snapshotService.GetLatestSnapshotFromQuery(org, repo, queries)    
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/latest response:`, JSON.stringify(snapshot, null, 2),  'req.query.params:', req.query);
    res.status(snapshot ? 200 : 404).json(snapshot);
};

export const getSnapshots = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots`, 'req.query.params:', req.query);
    const snapshotService = await getSnapshotService();
    const { org, repo } = req.params;
    const limit = req.query["top"] ?   req.query["top"] : 10
    const queries = Object.keys(req.query).map((k: string) => {if (k != "top") return { key: k, value: req.query[k]};}).filter(x => {return x != null} )
    const snapshot = await snapshotService.GetSnapshotsForRepo(org, repo, queries, limit)    
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots response:`, JSON.stringify(snapshot, null, 2),  'req.query.params:', req.query);
    res.status(snapshot ? 200 : 404).json(snapshot);
};
