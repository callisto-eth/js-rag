import { Client, GatewayIntentBits } from "discord.js";
import {config} from "dotenv"
import { handler } from "./cogs/event/OnMessageHandler";
import { VectorChunkStore } from "./db/astra";
import { GeminiLLM } from "./llm/gemini";

export const vectorStore = new VectorChunkStore();
export const llm = new GeminiLLM();

export const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,

	],
});

config();

client.on("ready",(bot)=>{
    console.log(`${bot.user.tag} has logged in!`)
})

client.on("messageCreate", async (msg) => {
    handler(msg)
});


client.login(process.env.DISCORD_BOT)

