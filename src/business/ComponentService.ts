import { getManager } from 'typeorm';
import { Snapshot } from '../database/entity/Snapshot';
import { Metadata } from '../database/entity/Metadata';
import { ICoordinates } from './SnapshotService';
import { SnapshotBranchProjection } from '../database/entity/SnapshotBranchProjection';


export async function getUsesOfComponentInOrg(componentCoordinates: ICoordinates, orgId: string): Promise<IRepoInformation[]>
{
    var repoReleasesMap : {[repo: string] : string[]} = await getReleasesWhereComponentExistInOrg(orgId, componentCoordinates);
    var repoBranchMap: {[repo: string] : string[]} = await getBranchesWhereComponentExistInOrg(orgId, componentCoordinates);
    
    const repos = await getManager().
    createQueryBuilder(SnapshotBranchProjection,"projection")
    .where("projection.OrganizationId = :orgId and projection.ComponentVersion =:version and projection.ComponentName = :name and projection.ComponentType= :type"
        ,{orgId: orgId, version: componentCoordinates.version, name: componentCoordinates.name, type: componentCoordinates.type})
        .select("projection.RepositoryId", "repoName")
        .distinct(true)
        .getRawMany();

    var result :IRepoInformation[] = []
    repos.forEach(repo => 
    {
        if (repoReleasesMap[repo.repoName] == null && repoBranchMap[repo.repoName] == null)
        {
            return;
        }

        var repoInformation:RepoInformation = new RepoInformation();
        repoInformation.repo = repo.repoName;
        repoInformation.releases = repoReleasesMap[repo.repoName] == null? []: repoReleasesMap[repo.repoName]
        repoInformation.branches = repoBranchMap[repo.repoName] == null? []: repoBranchMap[repo.repoName]

        result.push(repoInformation);
    });

    return result;
}

class RepoInformation
{
    repo: string;
    branches: string[];
    releases: string[];
}

async function getReleasesWhereComponentExistInOrg(orgId: string, componentCoordinates: ICoordinates) : Promise<{[repo: string] : string[]}>
{
    var projections = await getManager().getRepository(SnapshotBranchProjection)
    .find({where: [{OrganizationId:orgId, ComponentVersion: componentCoordinates.version, ComponentName: componentCoordinates.name, ComponentType: componentCoordinates.type}]});

    var repoReleasesMap : {[repo: string] : string[]} = {};
    projections.forEach(async (projection) => {
        var snapshot = await getManager().getRepository(Snapshot)
        .findOne({where: [{org: projection.OrganizationId, repo: projection.RepositoryId, snapshotId: projection.SnapshotId}], relations:["metadata"]});
        
        if(snapshot == null)
        {
            return;
        }
        
        var release = getSnapshotRelease(snapshot.metadata);
        
        if (release == null)
        {
            return ;
        }

        if(repoReleasesMap[snapshot.repo] == null)
        {
            repoReleasesMap[snapshot.repo] = []
        }
        
        repoReleasesMap[snapshot.repo].push(release);
    });

    return repoReleasesMap
}
async function getBranchesWhereComponentExistInOrg(org: string, coordinates: ICoordinates) : Promise<{[repo: string] : string[]}>
{
    let snapshots = await getManager().getRepository(Snapshot).find({where:[{org: org}], relations:["metadata"]});
    let latestSnapshotPerRepoAndBranch = getLatestSnapshotPerRepoAndBranch(snapshots);
    var repoBranchMap: {[repo: string] : string[]} = {};

    for (var repo in latestSnapshotPerRepoAndBranch)
    {
        for (var branch in latestSnapshotPerRepoAndBranch[repo])
        {
            var projection = await getManager().getRepository(SnapshotBranchProjection)
                .findOne({OrganizationId: org, 
                    RepositoryId: repo, 
                    Branch: branch, 
                    SnapshotId: latestSnapshotPerRepoAndBranch[repo][branch],
                    ComponentName: coordinates.name,
                    ComponentType: coordinates.type,
                    ComponentVersion: coordinates.version});
            
            if (projection != null)
            {
                if(repoBranchMap[repo] == null)
                {
                    repoBranchMap[repo] = [];
                }
                repoBranchMap[repo].push(branch);
            }
        }
    }

    return repoBranchMap;
}

function getSnapshotRelease(snapshotMetadata: Metadata[]): string
{
    var tagRelease = snapshotMetadata.find( metadata => metadata.key == "release");
    if (tagRelease == null)
    {
        return null;
    }
    return tagRelease.value
}

function getLatestSnapshotPerRepoAndBranch(snapshots: Snapshot[]): {[repo:string]: {[branch:string]: number}}
{
    var latestSnapshotPerRepoAndBranch :{[repo:string]: {[branch:string]: number}} = {}

    snapshots.forEach( snapshot => {
        let snapshotBranch = getSnapshotBranch(snapshot);
        if (snapshotBranch == null)
        {
            return;
        }
        
        if (latestSnapshotPerRepoAndBranch[snapshot.repo] == null)
        {
            latestSnapshotPerRepoAndBranch[snapshot.repo] = {}
        }
        if (latestSnapshotPerRepoAndBranch[snapshot.repo][snapshotBranch] == null)
        {
            latestSnapshotPerRepoAndBranch[snapshot.repo][snapshotBranch] = -1
        }

        latestSnapshotPerRepoAndBranch[snapshot.repo][snapshotBranch] = Math.max(latestSnapshotPerRepoAndBranch[snapshot.repo][snapshotBranch], snapshot.snapshotId)
    });

    return latestSnapshotPerRepoAndBranch;
}

function getSnapshotBranch(snapshot: Snapshot): string
{
    var tagBranch = snapshot.metadata.find(metadata => metadata.key == "branch");
    if (tagBranch == null)
    {
        return null;
    }
    return tagBranch.value;
}

export interface IRepoInformation
{
    repo: string;
    branches: string[];
    releases: string[]
};