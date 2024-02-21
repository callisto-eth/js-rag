import { Message } from "discord.js";
import { MessageChunkHandler } from "../../utils/MessageChunkHandler";
import { formatMessage } from "../../utils/MessageFormatter";

export default async function handler(msg: Message<boolean>) {
    await MessageChunkHandler.Instance.createOrUpdateChunk(
        formatMessage(
            msg.cleanContent,
            msg.author.globalName || msg.author.username
        ),
        msg.channel.id,
        msg.author.id
    );
    return;
}
