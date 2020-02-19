import { BlobServiceClient, ContainerClient, ContainerCreateResponse } from '@azure/storage-blob';
import { getManager } from 'typeorm';
import { Snapshot } from '../database/entity/Snapshot';

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

  public async saveSnapshot(snapshot: ISnapshot): Promise<void> {
    const snapshotEntity = getManager().getRepository(Snapshot);
    await snapshotEntity.insert(snapshot.metadata);
    const blockBlobClient = this.containerClient.getBlockBlobClient(`${snapshot.id}.json`);
    const snapshotBlob = JSON.stringify(snapshot);
    await blockBlobClient.upload(snapshotBlob, snapshotBlob.length);
  }

  public async getById(org: string, repo: string, snapshotId: number) {
    const blockBlobClient = this.containerClient.getBlockBlobClient(`${snapshotId}.json`);
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
        resolve(chunks.join(""));
      });
      readableStream.on('error', reject);
    });
  }
}

interface ISnapshotServiceOptions {
  connectionString: string
}

interface ISnapshot {
  id: string,
  org: string,
  repo: string,
  locations: ILocation[],
  metadata: Snapshot;
  createdAt: Date,
}

interface ILocation {
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

interface ICoordinates {
  type: ICoordinatesType,
  name: string,
  version: string
}

type ICoordinatesType = 'nuget' | 'npm' | 'maven' | 'git' | 'rubygem' | 'pypi' | 'cargo' | 'other' | 'file';

let snapshotService: SnapshotService;

export async function getSnapshotService() {
  if (snapshotService) {
    return snapshotService;
  }
  snapshotService = new SnapshotService({
    connectionString: process.env.BLOB_SERVICE_CONNECTION_STRING,
  });
  await snapshotService.init();
  return snapshotService;
}