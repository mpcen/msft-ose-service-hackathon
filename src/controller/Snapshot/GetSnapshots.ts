import { Request, Response } from 'express';

export const getSnapshots = async (req: Request, res: Response) => {
    console.log(`GET /snapshots/${req.params.id} id:`, 'req.query.params:', req.query);
    
    // GET FINAL SNAPSHOT INFORMATION BY SNAPSHOT ID
    const snapshotId = req.params.id;
    // INTEGRATION HERE
    //const snapshot = await getSnapshotById(snapshotId);

    // RETURN BACK
    const responseBody = {
        id: '12345',
        createdAt: new Date(),
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
    
    res.json(responseBody);
};
