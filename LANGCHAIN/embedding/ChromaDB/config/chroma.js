import { ChatCompletionAssistant200ResponseChoicesInnerFinishReasonEnum } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/assistant_data";
import { ChromaClient } from "chromadb";
import dotenv from "dotenv";

dotenv.config() ;

const client = new ChromaClient() ;

const collection = await client.createCollection({
    name: "first_collection"
})

export default collection ;
