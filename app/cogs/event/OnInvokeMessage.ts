import { Message } from "discord.js";
import { MessageChunkHandler } from "../../utils/MessageChunkHandler";
import { formatMessage } from "../../utils/MessageFormatter";
import { Chain } from "../../chain";
import { client } from "../..";

export default async function handler(msg: Message<boolean>) {
	msg.channel.sendTyping();
	await MessageChunkHandler.Instance.createOrUpdateChunk(
		formatMessage(
			msg.cleanContent,
			msg.author.globalName || msg.author.username
		),
		msg.channel.id,
		msg.author.id
	);

	const res = await Chain.invoke(
		formatMessage(
			msg.cleanContent,
			msg.author.globalName || msg.author.username
		)
	);

	await msg.reply(res);

	await MessageChunkHandler.Instance.createOrUpdateChunk(
		formatMessage(res, "FoundryAI"),
		msg.channel.id,
		client.user?.id || ""
	);

	return;
}
