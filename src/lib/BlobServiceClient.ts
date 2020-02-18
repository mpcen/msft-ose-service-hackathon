import {
  BlobService,
  createBlobServiceWithSas,
  ExponentialRetryPolicyFilter,
  createBlobService,
} from 'azure-storage';
import path from 'path';
import { URL } from 'url';
import { promisify } from 'util';

export default class BlobServiceClient implements IBlobServiceClient {
  private container: string;
  private getBlobToText: (container: string, blob: string) => Promise<string>;
  private createBlockBlobFromText: (container: string, blob: string, text: string) => Promise<BlobService.BlobResult>;

  constructor(options: IBlobServiceClientOptions) {
    let blobService: BlobService;
    if ('sas' in options) {
      blobService = this.createBlobServiceWithSasUrl(options);
    }
    if ('connectionString' in options) {
      blobService = this.createBlobServiceWithConnectionString(options);
    }
    this.getBlobToText = promisify<string, string, string>(blobService.getBlobToText.bind(blobService));
    this.createBlockBlobFromText = promisify<string, string, string, BlobService.BlobResult>(
      blobService.createBlockBlobFromText.bind(blobService),
    );
  }

  public async readBlob(blobName: string): Promise<string | undefined> {
    try {
      const result = await this.getBlobToText(this.container, blobName);
      return result;
    } catch (err) {
      if (err.statusCode === 404) {
        return;
      }
      throw err;
    }
  }

  public async createBlob(blobName: string, text: string): Promise<string> {
    try {
      const result = await this.createBlockBlobFromText(this.container, blobName, text);
      return result.requestId;
    } catch (err) {
      throw err;
    }
  }

  private createBlobServiceWithSasUrl(options: IBlobServiceClientOptionsWithSasUrl) {
    if (!options.sas) {
      throw new Error('sas url are required for BlobServiceClient');
    }
    const url = new URL(options.sas);
    const serviceEndpoint = url.hostname;
    const token = url.search;
    this.container = path.basename(url.pathname);
    return createBlobServiceWithSas(serviceEndpoint, token).withFilter(new ExponentialRetryPolicyFilter());
  }

  private createBlobServiceWithConnectionString(options: IBlobServiceClientOptionsWithConnectionString) {
    if (!options.connectionString) {
      throw new Error('connection string are required for BlobServiceClient');
    }
    return createBlobService(options.connectionString).withFilter(new ExponentialRetryPolicyFilter());
  }
}

export interface IBlobServiceClient {
  readBlob(blobName: string): Promise<string | undefined>;
  createBlob(blobName: string, text: string): Promise<string>;
}

export type IBlobServiceClientOptions = IBlobServiceClientOptionsWithSasUrl | IBlobServiceClientOptionsWithConnectionString;

interface IBlobServiceClientOptionsWithSasUrl {
  sas: string;
}

interface IBlobServiceClientOptionsWithConnectionString {
  connectionString: string;
}
