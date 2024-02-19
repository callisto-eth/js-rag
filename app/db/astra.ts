import {
    AstraDBVectorStore,
    AstraLibArgs
} from "@langchain/community/vectorstores/astradb"
import {
    GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai"
import {
    TaskType
} from "@google/generative-ai"
import dotenv from 'dotenv'

dotenv.config()

const config: AstraLibArgs = {
    token: process.env.ASTRA_DB_APPLICATION_TOKEN || "",
    endpoint: process.env.ASTRA_DB_API_ENDPOINT || "",
    collection: process.env.ASTRA_COLLECTION_NAME || ""
}


const googleEmbeddings:GoogleGenerativeAIEmbeddings = new GoogleGenerativeAIEmbeddings({
    modelName: "embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,

})
class AstraVectorDB {
    vstore: AstraDBVectorStore;
    constructor(embeddings: GoogleGenerativeAIEmbeddings, config: AstraLibArgs) {
        this.vstore = new AstraDBVectorStore(embeddings, config)
    }

    
}

async function InsertDocument() {
    
}
