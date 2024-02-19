import { VectorStore } from "..";
import { VectorChunkStore } from "../db/Astra";

type ChunkStore = {
	[key: string]: {
		// ChannelID (prevent conflict of conversations in different channels)
		currentChunk: string;
	};
};

export class MessageChunkHandler {
	vectorStore: VectorChunkStore;
	currentChunkStore: ChunkStore = {};
	constructor(vectorStore: VectorChunkStore = VectorStore) {
		this.vectorStore = vectorStore;
	}

	async createOrUpdateChunk(channelId: string, message: string) {
        this.currentChunkStore[channelId].currentChunk += message;
        console.log(
            `MessageChunkHandler: Updated current chunk for channel ${channelId}\nAdded message ${message} to existing chunk`
        );

        if (!this.currentChunkStore[channelId]) {
            this.currentChunkStore[channelId] = {
                currentChunk: message,
			};
			return;
		}

		if (this.currentChunkStore[channelId].currentChunk.length < 1200) return;

        
		this.vectorStore.InsertMessageChunk(
			this.currentChunkStore[channelId].currentChunk.substring(0, 1200),
			channelId
		);
		console.log(
			`MessageChunkHandler: Inserted new chunk into database from channel ${channelId}`
		);
		return;
	}
}
