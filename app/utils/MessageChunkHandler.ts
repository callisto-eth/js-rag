import { Message, User } from "discord.js";
import { VectorChunkStore } from "../db/Astra";
// import { VectorStore } from "../chain";

type ChunkStore = {
	[key: string]: {
		// msg.channelId (prevent conflict of conversations in different channels
		currentChunk: string;
		lastUser: string;
	};
};

export class MessageChunkHandler {
	vectorStore: VectorChunkStore;
	currentChunkStore: ChunkStore = {};

	static Instance = new this(VectorChunkStore.Instance);

	constructor(vectorStore: VectorChunkStore) {
		this.vectorStore = vectorStore;
		console.log("MessageChunkHandler: Initialized MessageChunkHandler");
	}

	async createOrUpdateChunk(msg: string, channelId: string, author: string) {
		console.log(
			`MessageChunkHandler: Updated current chunk for channel ${channelId}\nAdded message ${msg} to existing chunk`
		);

		if (!this.currentChunkStore[channelId]) {
			this.currentChunkStore[channelId] = {
				currentChunk: msg,
				lastUser: author,
			};
			return;
		}

		this.currentChunkStore[channelId].currentChunk += msg;
		if (this.currentChunkStore[channelId].currentChunk.length < 600) return;

		this.vectorStore.InsertMessageChunk(
			this.currentChunkStore[channelId].currentChunk.substring(0, 600),
			channelId
		);
		console.log(
			`MessageChunkHandler: Inserted new chunk into database from channel ${channelId}`
		);
		return;
	}
}
