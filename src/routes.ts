import { getAllComponents } from './controller/Component/GetAllComponents';
import { postComponent } from './controller/Component/PostComponent';
import { getSnapshots } from './controller/Snapshot/GetSnapshots';
import { postSnapshots } from './controller/Snapshot/PostSnapshots';
import { getAlerts } from './controller/Alert/GetAlerts';
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
        path: '/:org/:repo/snapshots/:id',
        method: 'get',
        action: getSnapshots
    },
    {
        path: '/:org/:repo/snapshots',
        method: 'post',
        action: postSnapshots
    },
    {
        path: '/:org/:repo/alerts/:snapshotId',
        method: 'get',
        action: getAlerts
    },
];
