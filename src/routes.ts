import { getAllComponents } from './controller/Component/GetAllComponents';
import { postComponent } from './controller/Component/PostComponent';
import { getSnapshotById, getSnapshots, getLatestSnapshot } from './controller/Snapshot/GetSnapshots';
import { postSnapshots } from './controller/Snapshot/PostSnapshots';
import { getUseOfComponentInOrg } from './controller/Component/GetUseOfComponentInOrg';
import { getAlerts, getAlertsByLatestSnapshot } from './controller/Alert/GetAlerts';
import { Response, Request } from 'express';

type Route = {
    path: string;
    method: 'get' | 'put' | 'post' | 'delete' | 'patch' | 'options';
    action: (req: Request, res: Response) => Promise<void>;
};

export const AppRoutes: Route[] = [
    {
        path: '/components',
        method: 'get',
        action: getAllComponents
    },
    {
        path: '/components',
        method: 'post',
        action: postComponent
    },
    {
        path: '/:org/:repo/snapshots/:id(\\d+)',
        method: 'get',
        action: getSnapshotById
    },
    {
        path: '/:org/:repo/snapshots',
        method: 'get',
        action: getSnapshots
    },
    {
        path: '/:org/:repo/snapshots/latest',
        method: 'get',
        action: getLatestSnapshot
    },
    {
        path: '/:org/:repo/snapshots',
        method: 'post',
        action: postSnapshots
    },
    {
        path: '/:org/:repo/alerts/:snapshotId(\\d+)',
        method: 'get',
        action: getAlerts
    },
    {
        path: '/:org/components',
        method: 'post',
        action: getUseOfComponentInOrg
    },
    {
        path: '/:org/:repo/alerts/latest',
        method: 'get',
        action: getAlertsByLatestSnapshot
    }
];
