import * as blob  from '@azure/storage-blob'
const uuidv1 = require('uuid/v1');

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here

    // Create the BlobServiceClient object which will be used to create a container client
    
    // Uncomment this when actually using this code in the service layer
    //const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const AZURE_STORAGE_CONNECTION_STRING = "UseDevelopmentStorage=true";
    const blobServiceClient : blob.BlobServiceClient= await blob.BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    // Get a reference to a container

    // Uncomment this when actually using this code in the service layer
    //const AZURE_STORAGE_CONTAINER_NAME = process.env.AZURE_STORAGE_CONTAINER_NAME;
    const AZURE_STORAGE_CONTAINER_NAME = "oseservicecontainer";
    const containerClient : blob.ContainerClient = await blobServiceClient.getContainerClient(AZURE_STORAGE_CONTAINER_NAME);

    // Create the container
    if (!await containerClient.exists())
    {
        const createContainerResponse : blob.ContainerCreateResponse = await containerClient.create();
    }

    // Get a block blob client
    let blobName : string = "blob" + uuidv1() + '.txt'
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload data to the blob
    const data = 'Hello, World!';
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);

    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));
}

// A helper function used to read a Node.js readable stream into a string
async function streamToString(readableStream : NodeJS.ReadableStream) {
    return new Promise((resolve, reject) => {
      const chunks : string[] = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }

main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));