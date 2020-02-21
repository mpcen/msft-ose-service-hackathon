import axios from 'axios';
import { getSnapshotService } from './SnapshotService';
export class Tag {
    key: string;
    value: string;
}

export default class AlertService {
    constructor(){
    }

    public async getAlertFromCDS(org: string, repo: string, snapshotId: number) {
        const snapshotService = await getSnapshotService();
        const snapshot = await snapshotService.getById(org, repo, snapshotId);
        let components = snapshot.locations.map((location: { components: any; }) => location.components);
        let coordinates = components[0].map((x: { coordinates: any; }) => x.coordinates);
        var result = new Array();

        for(var coordinate of coordinates){                        
            var data = this.GetRequestData(coordinate);
            try{
                const response = await axios({
                    method: 'post',
                    url: 'https://cds.cg.microsoft.com/api/searches?$expand=vulnerabilities',
                    data: data          
                })
    
                var alert = new Alert(coordinate, response.data);
                result.push(alert);
            }catch{

            }
        }

        return result;
    }

    public async getAlertFromLatest(org: string, repo: string, queries: Tag[]) {
        const snapshotService = await getSnapshotService();
        
        const snapshot = await snapshotService.GetLatestSnapshotFromQuery(org, repo, queries);
        let components = snapshot.locations.map((location: { components: any; }) => location.components);
        let coordinates = components[0].map((x: { coordinates: any; }) => x.coordinates);
        var result = new Array();

        for(var coordinate of coordinates){                        
            var data = this.GetRequestData(coordinate);
            try{
                const response = await axios({
                    method: 'post',
                    url: 'https://cds.cg.microsoft.com/api/searches?$expand=vulnerabilities',
                    data: data          
                })
    
                var alert = new Alert(coordinate, response.data);
                result.push(alert);
            }catch{
            }
        }

        return result;
    }
    
    public GetRequestData(coordinate: any){
        var componentName = coordinate.name;
        var version = coordinate.version;
        var type = coordinate.type; 
        var forgeKey = this.ForgeToKey(type);
        var searchRequest = this.GenerateComponentSearchRequest(type, componentName, version);

        var requestData = {
            "component": {
                [forgeKey]: searchRequest
            }
        };

        return requestData;
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

class Alert{
    coordinate: any;
    vulnerabilities: any;

    constructor(coordinate: any, vulnerabilities: any){
        this.coordinate =  coordinate;
        this.vulnerabilities = vulnerabilities;
    }
}