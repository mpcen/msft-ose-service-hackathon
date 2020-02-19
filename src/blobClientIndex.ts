import BlobServiceClient  from './lib/BlobServiceClient'

async function main() {
    console.log('Azure Blob storage v12 - JavaScript quickstart sample');
    // Quick start code goes here

    // Create the BlobServiceClient object which will be used to create a container client
    const blobServiceClient = new BlobServiceClient(
        {
            connectionString: "UseDevelopmentStorage=true"
        } 
    );

    await blobServiceClient.createBlob("chsalgadBlob", "helloWorld");

    let text = await blobServiceClient.readBlob("chsalgad");

    console.log(text);
}

main().then(() => console.log('Done')).catch((ex) => console.log(ex.message));