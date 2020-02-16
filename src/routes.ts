import { getAllComponents } from './controller/Component/GetAllComponents';
import { postComponent } from './controller/Component/PostComponent';
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
    }
];
