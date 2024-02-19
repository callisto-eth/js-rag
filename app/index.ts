import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { handler } from "./cogs/event/OnMessageHandler";
import { VectorChunkStore } from "./db/Astra";
import { GeminiLLM } from "./llm/Gemini";

export const VectorStore = new VectorChunkStore();
export const LLM = new GeminiLLM();

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

config();

client.on("ready", (bot) => {
	console.log(`${bot.user.tag} has logged in!`);
});

client.on("messageCreate", async (msg) => {
	if (msg.author.bot) return;
	if (client.user&&msg.mentions.has(client.user)) {
		
	}
});

client.login(process.env.DISCORD_BOT);
