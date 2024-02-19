import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { handler } from "./cogs/event/OnMessageHandler";
import { VectorStore } from "./chain";

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

config();

client.on("ready", async (bot) => {
	await VectorStore.initialize();
	console.log(`${bot.user.tag} has logged in!`);
});

client.on("messageCreate", handler);

client.login(process.env.DISCORD_BOT);
