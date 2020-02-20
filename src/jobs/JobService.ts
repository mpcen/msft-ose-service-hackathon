import {ProcessedSnapshots} from '../database/entity/ProcessedSnapshots'
import {SnapshotBranchProjection} from '../database/entity/SnapshotBranchProjection'
import {ISnapshot} from '../business/SnapshotService'
import { getSnapshotService } from '../business/SnapshotService';
import { getManager, EntityManager } from 'typeorm';

export class JobService {
  constructor() { }

  
  public async processSnapshot(jobName: string): Promise<void> {
    let pendingSnapshots = await this.getPendingSnapshots(jobName);

    if (pendingSnapshots.length == 0)
    {
      console.info("No pending snapshots to process")
      return;
    }

    let projections = this.getProjectionFromSnapshots(pendingSnapshots);
    await this.saveProjections(projections);
    let latestSnapshotProcessed = Math.max(...pendingSnapshots.map(snapshot => {return snapshot.id}));
    await this.updateJobProcessSnapshot(latestSnapshotProcessed, jobName)
  }

  private async getPendingSnapshots(jobName: string): Promise<ISnapshot[]> {
    let jobProcessedSnapshot = await getManager()
      .getRepository(ProcessedSnapshots)
      .findOne(jobName);

    let snapshotId = jobProcessedSnapshot == null ? -1 : jobProcessedSnapshot.SnapshotId;
    var snapshotService = await getSnapshotService();
    return snapshotService.GetSnapshotsWithIdGreaterThan(snapshotId)
  }

  private getProjectionFromSnapshots(snapshots: ISnapshot[]): SnapshotBranchProjection[]{
    var snapshotBranchProjection: SnapshotBranchProjection[] = [];
    snapshots.forEach(snapshot => {
      snapshot.locations.forEach(location => { 
        location.components.forEach(component =>{
          let branchProjection = new SnapshotBranchProjection();
          branchProjection.OrganizationId = snapshot.org;
          branchProjection.RepositoryId = snapshot.repo;
          branchProjection.SnapshotId = snapshot.id;
          branchProjection.Branch = snapshot.branch;
          branchProjection.ComponentName = component.coordinates.name;
          branchProjection.ComponentVersion = component.coordinates.version;
          branchProjection.ComponentType = component.coordinates.type

          snapshotBranchProjection.push(branchProjection)
        });
      });
    });
    return snapshotBranchProjection;
  }

  private async saveProjections(projections: SnapshotBranchProjection[]): Promise<void> {
    await getManager().transaction( async transactionalEntityManager => {
      await transactionalEntityManager.save<SnapshotBranchProjection>(projections)
    });
  }

  private async updateJobProcessSnapshot(snapshotid: number, jobName: string): Promise<void> {

    var jobProcessedSnapshot:ProcessedSnapshots = await getManager()
      .getRepository(ProcessedSnapshots)
      .findOne(jobName)

    if (jobProcessedSnapshot == null)
    {
      jobProcessedSnapshot = new ProcessedSnapshots();
      jobProcessedSnapshot.JobName = jobName;
    }
    jobProcessedSnapshot.SnapshotId = snapshotid

    await getManager().save(jobProcessedSnapshot)
  }
}