import { GuildMember } from "discord.js";
import { VectorChunkStore } from "../db/Astra";

type ChunkStore = {
	[key: string]: {
		// ChannelID (prevent conflict of conversations in different channels)
		currentChunk: string;
		lastUser:GuildMember
	};
};

export class MessageChunkHandler {
	vectorStore: VectorChunkStore;
	currentChunkStore: ChunkStore = {};

	static Instance = this;


	constructor(vectorStore: VectorChunkStore) {
		this.vectorStore = vectorStore;
		console.log("MessageChunkHandler: Initialized MessageChunkHandler");
	}

	async createOrUpdateChunk(channelId: string, message: string,author:GuildMember) {
		console.log(
			`MessageChunkHandler: Updated current chunk for channel ${channelId}\nAdded message ${message} to existing chunk`
		);

		if (!this.currentChunkStore[channelId]) {
			this.currentChunkStore[channelId] = {
				currentChunk: message,
				lastUser:author
			};
			return;
		}

		this.currentChunkStore[channelId].currentChunk += message;
		if (this.currentChunkStore[channelId].currentChunk.length < 800)
			return;

			
		this.vectorStore.InsertMessageChunk(
			this.currentChunkStore[channelId].currentChunk.substring(0, 800),
			channelId
		);
		console.log(
			`MessageChunkHandler: Inserted new chunk into database from channel ${channelId}`
		);
		return;
	}
}

