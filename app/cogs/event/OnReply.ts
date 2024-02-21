import { Message } from "discord.js";
import { MessageChunkHandler } from "../../utils/MessageChunkHandler";
import {
	formatMessage,
	formatReplyMessage,
} from "../../utils/MessageFormatter";
import { client } from "../..";
import { Chain } from "../../chain";

export default async function handler(msg: Message<boolean>) {
	if (!msg.reference?.messageId) return;
	const refMessage = await msg.fetchReference();

	// On Basic message!
	if (refMessage.author.id !== client.user?.id) {
		await MessageChunkHandler.Instance.createOrUpdateChunk(
			formatReplyMessage(
				msg.cleanContent,
				msg.author.globalName || msg.author.username,
				refMessage.cleanContent,
				refMessage.author.globalName || refMessage.author.username
			),
			msg.channel.id,
			msg.author.id
		);
		return;
	}

	await msg.channel.sendTyping();

	// On Invoke Message!
	await MessageChunkHandler.Instance.createOrUpdateChunk(
		formatReplyMessage(
			msg.cleanContent,
			msg.author.globalName || msg.author.username,
			refMessage.cleanContent,
			refMessage.author.globalName || refMessage.author.username
		),
		msg.channel.id,
		msg.author.id
	);
	const res = await Chain.invoke(
		formatReplyMessage(
			msg.cleanContent,
			msg.author.globalName || msg.author.username,
			refMessage.cleanContent,
			refMessage.author.globalName || refMessage.author.username
		)
	);

	await msg.reply(res);

	await MessageChunkHandler.Instance.createOrUpdateChunk(
		formatReplyMessage(
			res,
			"FoundryAI",
			msg.cleanContent,
			msg.author.globalName || msg.author.username
		),
		msg.channel.id,
		client.user?.id || ""
	);

	return;
}
