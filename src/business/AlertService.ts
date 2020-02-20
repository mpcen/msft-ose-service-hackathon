import axios from 'axios';
import { getSnapshotService } from './SnapshotService';

export default class AlertService {
    constructor(){
    }

    public async getAlertFromCDS(org: string, repo: string, snapshotId: number) {
        const snapshotService = await getSnapshotService();
        const snapshot = await snapshotService.getById(org, repo, snapshotId);
      
        // Todo integration here
        var componentName = "express";
        var version = "4.0.0";
        var type = "npm"; 
        var forgeKey = this.ForgeToKey(type);
        var searchRequest = this.GenerateComponentSearchRequest(type, componentName, version);

        var component = {
            "component": {
            [forgeKey]: searchRequest
            }
        };

        const response = await axios({
            method: 'post',
            url: 'https://cds.cg.microsoft.com/api/searches?$expand=vulnerabilities',
            data: component          
        })

        return response.data
    }

    public ForgeToKey(type: string) : string
    {
        switch (type.toLocaleLowerCase())
        {
            case "cargo": return "cargo";
            case "git": return "github";
            case "maven": return "maven.org";
            case "npm": return "npmjs.org";
            case "nuget": return "nuget.org";
            case "other": return "others";
            case "pip": return "pypi";
            case "rubygems": return "rubygem";
            case "go": return "go";
        }
    }

    public GenerateComponentSearchRequest(type: string, name: string, version: string)
    {
        let searchRequest;
        switch (type.toLocaleLowerCase())
        {
            // Does this need github as well?
            case "maven":
                searchRequest = 
                {                    
                    "Version": version,
                    "GroupId": name.split(':')[0],
                    "ArtifactId": name.split(':')[1]
                };
                break;

            case "git":
                var split = name.split('/');
                if (split.length == 2)
                {
                    searchRequest =
                    {
                        "CommitHash": version,
                        "Repository": split[1],
                        "Owner": split[0]
                    };
                }
                else
                {                    
                    searchRequest =
                    {
                        "name": name,
                        "version": version,
                    };
                }
                break;

            case "other":
                searchRequest =
                {
                    "name": name,
                    "version": version,
                };
                break;

            default:
                searchRequest =
                {
                    "name": name,
                    "version": version,
                };
        }

        return searchRequest;
    }
}

let alertService: AlertService;

export async function getAlertService() {
    if (alertService) {
      return alertService;
    }
    alertService = new AlertService();
    return alertService;
}