import { BlobServiceClient, ContainerClient, ContainerCreateResponse } from '@azure/storage-blob';
import { getManager, MoreThan } from 'typeorm';
import { Snapshot } from '../database/entity/Snapshot';
import { Metadata } from '../database/entity/Metadata';

const uuidv1 = require('uuid/v1')
class Tag {
    key: string;
    value: string;
}

export default class SnapshotService {
  private blobService: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor(options: ISnapshotServiceOptions) {
    this.blobService = BlobServiceClient.fromConnectionString(options.connectionString);
  }

  public async init() {
    const AZURE_STORAGE_CONTAINER_NAME = 'oseservicecontainer';
    this.containerClient = this.blobService.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);
    if (!await this.containerClient.exists()) {
        await this.containerClient.create();
    }
  }


  public async  GetLatestSnapshotFromQuery(org: string, repo: string, queries: Tag[])  {
    // Given a set of queries, find the latest snapshot that matches all of them.
        let test = await getManager();
        const latestSnapshot = await getManager()
            .getRepository(Snapshot).createQueryBuilder("s")
            .innerJoin(qb => { 
                return qb.subQuery().from(
                    "(SELECT * FROM JSON_TABLE(\'" + JSON.stringify(queries) +"\','$[*]' COLUMNS(k VARCHAR(40) PATH '$.key' , v VARCHAR(40) PATH '$.value')) `q`)" ,
                    "q");},
            "q",
            "s.repo = :repo AND s.org = :org AND s.key = q.k AND s.value = q.v",
            {repo: repo, org: org})
            .groupBy("BlobId")
            .select("*, COUNT(blobId) as matches")
            .having("matches = :queries",  {queries: queries.length})
            .orderBy("snapshotId","DESC")
            .getRawOne();
        console.log(latestSnapshot);
        return latestSnapshot           
    }

  public async GetSnapshotsWithIdGreaterThan(snapshotId: number): Promise<ISnapshot[]> {
      let snapshots: Snapshot[] = await getManager()
      .getRepository(Snapshot)
      .find({snapshotId: MoreThan(snapshotId)})

      return Promise.all(snapshots.map( async (snapshot): Promise<ISnapshot> => {
        var test = await this.getById("orgname","reponame",snapshot.snapshotId);
        const blockBlobClient = this.containerClient.getBlockBlobClient(`${snapshot.blobId}.json`);
        var downloadBlockResponse = await blockBlobClient.download(0);
        var snapshotModel = JSON.parse(await this.streamToString(downloadBlockResponse.readableStreamBody));
        snapshotModel.metadata.snapshotId = snapshot.snapshotId
        return snapshotModel;
      }));
  }

  public async saveSnapshot(snapshot: ISnapshot): Promise<Snapshot> {
    const snapshotRepository = getManager().getRepository(Snapshot);
    let snapshotToCreate: Snapshot = snapshot.metadata;
    snapshotToCreate.blobId = uuidv1();
    snapshotToCreate.metadata = snapshotToCreate.metadata
    const blockBlobClient = this.containerClient.getBlockBlobClient(`${snapshotToCreate.blobId}.json`);
    const snapshotBlob = JSON.stringify(snapshot);
    await blockBlobClient.upload(snapshotBlob, snapshotBlob.length);
    return await snapshotRepository.save(snapshotToCreate);
  }

  public async getById(org: string, repo: string, snapshotId: number) {
    const metadata = await this.getMetadataById(org, repo, snapshotId);
    if (!metadata) {
      return;
    }
    const blockBlobClient = this.containerClient.getBlockBlobClient(`${metadata.blobId}.json`);
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    return JSON.parse(await this.streamToString(downloadBlockBlobResponse.readableStreamBody));
  }

  public async getMetadataById(org: string, repo: string, snapshotId: number) {
    const snapshot = getManager().getRepository(Snapshot);
    return snapshot.findOne({
      org,
      repo,
      snapshotId,
    });
  }

  private streamToString(readableStream : NodeJS.ReadableStream): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks : string[] = [];
      readableStream.on('data', (data) => {
        chunks.push(data.toString());
      });
      readableStream.on('end', () => {
        resolve(chunks.join(''));
      });
      readableStream.on('error', reject);
    });
  }
}

interface ISnapshotServiceOptions {
  connectionString: string
}

export interface ISnapshot {
  id: number,
  org: string,
  repo: string,
  branch: string,
  locations: ILocation[],
  metadata: Snapshot;
  createdAt: Date,
}

export interface ILocation {
  path: string,
  components: [{
    coordinates: ICoordinates,
    usage: {
      devDependency: boolean
    },
    dependencies: ICoordinates[],
    directDependency: true
  }]
}

export interface ICoordinates {
  type: ICoordinatesType,
  name: string,
  version: string
}

export type ICoordinatesType = 'nuget' | 'npm' | 'maven' | 'git' | 'rubygem' | 'pypi' | 'cargo' | 'other' | 'file';

let snapshotService: SnapshotService;

export async function getSnapshotService() {
  if (snapshotService) {
    return snapshotService;
  }
  snapshotService = new SnapshotService({
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  });
  await snapshotService.init();
  return snapshotService;
}




