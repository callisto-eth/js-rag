import { Message } from "discord.js";
import { client } from "../..";
import { formatMessage } from "../../utils/MessageFormatter";
import { MessageChunkHandler } from "../../utils/MessageChunkHandler";
import { VectorStore, Chain} from "../../chain";

const chunkHandler: MessageChunkHandler = new MessageChunkHandler(VectorStore);

export async function handler(msg: Message<boolean>) {
	if (msg.author.id == "1208042095076577300") return;

	if (client.user && msg.mentions.has(client.user)) {
		chunkHandler.createOrUpdateChunk(
			msg.channel.id,
			formatMessage(msg.cleanContent, msg.author.globalName||msg.author.username)
		);
		const res = await Chain.invoke(
			formatMessage(msg.cleanContent, msg.author.globalName||msg.author.username)
		);
		chunkHandler.createOrUpdateChunk(
			msg.channel.id,
			formatMessage(res, "FoundryAI(you)")
		);
		
		if(res.length > 2000) { 
			for(let i=0; i < Math.floor(res.length / 2000); i++) {
				await msg.reply(res.substring(i*2000,(i+1)* 2000))
			}
		}
		await msg.reply(res)
        return;
	}

	await chunkHandler.createOrUpdateChunk(
		msg.channel.id,
		formatMessage(msg.cleanContent, msg.author.globalName||msg.author.username)
	);
	return; //Add the update shit here...
}
