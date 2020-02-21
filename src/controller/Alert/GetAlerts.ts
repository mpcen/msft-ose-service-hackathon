import { Request, Response } from 'express';
import { getAlertService } from '../../business/AlertService';

export const getAlerts = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/alerts/${req.params.snapshotId} id:`, 'req.query.params:', req.query);
    const alertService = await getAlertService();
    const { org, repo, snapshotId } = req.params;
    const alerts = await alertService.getAlertFromCDS(org, repo, parseInt(snapshotId));
    res.status(alerts ? 200 : 404).json(alerts);
}

export const getAlertsByLatestSnapshot = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/alerts/latest`, 'req.query.params:', req.query);
    const alertService = await getAlertService();
    const { org, repo } = req.params;
    const queries = Object.keys(req.query).map((k: string) => {return { key: k, value: req.query[k]};});
    const alerts = await alertService.getAlertFromLatest(org, repo, queries);
    res.status(alerts ? 200 : 404).json(alerts);
}