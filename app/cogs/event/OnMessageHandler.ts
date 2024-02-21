import { Message } from "discord.js";
import { client } from "../..";
import OnInvokeMessage from "./OnInvokeMessage";
import OnReplyHandler from "./OnReply";
import OnBaseMessageHandler from "./OnBaseMessage";

export async function handler(msg: Message<boolean>) {
	if (msg.author.id == client.user?.id) return;

	if (msg.reference?.messageId) {
		await OnReplyHandler(msg);
		return;
	}
	
	if (client.user && msg.mentions.has(client.user)) {
		await OnInvokeMessage(msg);
		return;
	}

	await OnBaseMessageHandler(msg);
}
