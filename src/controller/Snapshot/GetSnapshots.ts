import { Request, Response } from 'express';

export const getSnapshots = async (req: Request, res: Response) => {
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/${req.params.id} id:`, 'req.query.params:', req.query);
    // TODO: fetch from DB and blob storage
    const responseBody = {
        id: '12345',
        createdAt: new Date(),
        org: req.params.org,
        repo: req.params.repo,
        locations: [
            {
                path: 'path/to/metadata/file/package.json',
                components: [
                    {
                        coordinates: {
                            'type': 'npm',
                            'name': 'express',
                            'version': '4.0.0'
                        },
                        usage: {
                            devDependency: false
                        },
                        dependencies: [
                            {
                                coordinates: {
                                    type: 'npm',
                                    name: 'ajv',
                                    version: '6.11.0'
                                }
                            }
                        ],
                        directDependency: true
                    }
                ],
                metadata: req.query
            }
        ]
    };
    console.log(`GET /${req.params.org}/${req.params.repo}/snapshots/${req.params.id} response:`, 'req.query.params:', JSON.stringify(responseBody, null, 2));
    res.json(responseBody);
};
