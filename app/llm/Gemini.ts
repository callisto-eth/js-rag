import {
	ChatGoogleGenerativeAI,
	GoogleGenerativeAIChatInput,
} from "@langchain/google-genai";
import SafetySettings from "../config/GeminiSafetySettings";
import dotenv from "dotenv";

dotenv.config();

const defaultConfig = {
	modelName: "gemini-pro",
	apiKey: process.env.GOOGLE_API_KEY,
	safetySettings: SafetySettings,
};

export class GeminiLLM extends ChatGoogleGenerativeAI {
	constructor(config: GoogleGenerativeAIChatInput = defaultConfig) {
		super(config);
		console.log("GeminiLLM: Initialized GeminiLLM");
	}
}
