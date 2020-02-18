import { getAllComponents } from './controller/Component/GetAllComponents';
import { postComponent } from './controller/Component/PostComponent';
import { getSnapshots } from './controller/Snapshot/GetSnapshots';
import { postSnapshots } from './controller/Snapshot/PostSnapshots';
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
        path: '/snapshots/:id',
        method: 'get',
        action: getSnapshots
    },
    {
        path: '/snapshots',
        method: 'post',
        action: postSnapshots
    }
];
