import {ProcessedSnapshots} from '../database/entity/ProcessedSnapshots'
import {SnapshotBranchProjection} from '../database/entity/SnapshotBranchProjection'
import {ISnapshot} from '../business/SnapshotService'
import { getSnapshotService } from '../business/SnapshotService';
import { getManager, EntityManager } from 'typeorm';
import { createConnection } from 'net';

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
    await getManager().transaction( async transactionalEntityManager => {
      await this.saveProjections(transactionalEntityManager, projections);
      let latestSnapshotProcessed = Math.max(...pendingSnapshots.map(snapshot => {return snapshot.id}));
      await this.updateJobProcessSnapshot(transactionalEntityManager, latestSnapshotProcessed, jobName)
    });
   
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
    var snapshotBranchProjection: SnapshotBranchProjection[];
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

  private async saveProjections(transactionManager: EntityManager, projections: SnapshotBranchProjection[]): Promise<void> {
    await transactionManager.save(projections)
  }

  private async updateJobProcessSnapshot(transactionManager: EntityManager, snapshotid: number, jobName: string): Promise<void> {
    var jobProcessedSnapshot:ProcessedSnapshots = await transactionManager
      .findOne(jobName)

    jobProcessedSnapshot.SnapshotId = snapshotid

    await transactionManager.save(jobProcessedSnapshot)
  }
}