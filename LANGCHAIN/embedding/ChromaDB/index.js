import getCollection from "./config/chroma";

const collection = await getCollection();

await collection.add