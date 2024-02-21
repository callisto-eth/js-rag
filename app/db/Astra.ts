import {
	AstraDBVectorStore,
	AstraLibArgs,
} from "@langchain/community/vectorstores/astradb";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { TaskType } from "@google/generative-ai";
import { EmbeddingsInterface } from "@langchain/core/embeddings";

import dotenv from "dotenv";
import { Document, DocumentInterface } from "@langchain/core/documents";

dotenv.config();

const defaultConfig: AstraLibArgs = {
	token: process.env.ASTRA_DB_APPLICATION_TOKEN || "",
	endpoint: process.env.ASTRA_DB_API_ENDPOINT || "",
	collection: process.env.ASTRA_COLLECTION_NAME || "",
	collectionOptions: {
		vector: {
			dimension: 768,
			metric: "cosine"
		}
	}
};

const defaultGoogleEmbeddings: EmbeddingsInterface =
	new GoogleGenerativeAIEmbeddings({
		modelName: "embedding-001",
		taskType: TaskType.RETRIEVAL_DOCUMENT,
		apiKey: process.env.GOOGLE_API_KEY || "",
	});

export class VectorChunkStore extends AstraDBVectorStore {
	config: AstraLibArgs;

	public static Instance = new this();
	constructor(
		embeddings: EmbeddingsInterface = defaultGoogleEmbeddings,
		config: AstraLibArgs = defaultConfig
	) {
		super(embeddings, config);
		this.config = config;
	}
	
	async InsertMessageChunk(textBody: string, channelId: string) {
		await this.addDocuments([
			new Document({
				pageContent: textBody,
				metadata: { channelId: channelId },
			}),
		]);
		console.log("VectorChunkStore: Inserted new chunk into database");
	}

	async SearchMessageChunk(
		textBody: string,
		channelId?: string
	): Promise<DocumentInterface<Record<string, any>>[]> {
		const res = await this.similaritySearch(
			textBody,
			5,
			channelId ? { channelId: channelId } : undefined
		);
		return res;
	}

	// Thanks to our dearest astradb langchain js for NOT returning an ID for the document
	// async EditMessageChunk(id: string, updatedText: string) {
	// 	const res = await this.delete({ ids: [id] });
	// 	await this.InsertMessageChunk(updatedText, [id]);
	// 	return res;
	// }
}

