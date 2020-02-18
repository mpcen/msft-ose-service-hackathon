import { Request, Response } from 'express';

export const postSnapshots = async (req: Request, res: Response) => {
    const snapshotInformation = req.body; // req.body will be the same format as fakeBlob
    const fakeBlobComingFromPostBody = {
        locations: [
                {
                    "path": "path/to/metadata/file/package.json",
                    "components": [
                        {
                            "coordinates": {
                                "type": "npm",
                                "name": "express",
                                "version": "4.0.0"
                            },
                            "usage": {
                                "devDependency": false
                            },
                            "children": [{
                                "coordinates": {
                                    "type": "npm",
                                    "name": "ajv",
                                    "version": "6.11.0"
                                }
                            }],
                            "directDependency": true
                        }
                    ],
                    "metadata": {
                        "commit": "jgljlgjrgjortgrtop",
                        "branch": "master",
                        "release": "",
                        "workflow": "123",
                        "run": "567"
                    },
                }
            ]
        };

    // INTEGRATION GOES HERE
    // const snapshotBlobResponse = await snapshotService.store(snapshotInformation);

    // res.json(fakeBlobComingFromPostBody PLUS createdAt + id)
    res.json(fakeBlobComingFromPostBody);
};
