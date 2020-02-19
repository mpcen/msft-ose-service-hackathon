import { Request, Response } from 'express';

export const getAlerts = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/alerts/${req.params.id} id:`, 'req.query.params:', req.query);
    // TODO: fetch from DB and blob storage
    const responseBody = {
        id: '1',
        createdAt: new Date(),
        org: req.params.org,
        repo: req.params.repo,
        alerts: [
            {
                alertId: '1',
                title: "alert1",
                description: "description1"
            },
            {
                alertId: '2',
                title: "alert2",
                description: "description2"
            }
        ]
    };
    console.log(`GET /${req.params.org}/${req.params.repo}/alerts/${req.params.id} response:`, 'req.query.params:', JSON.stringify(responseBody, null, 2));
    res.json(responseBody);
};
