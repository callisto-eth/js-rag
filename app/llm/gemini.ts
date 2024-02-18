import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";

dotenv.config();

export const GeminiModel = new ChatGoogleGenerativeAI({
	modelName: "gemini-pro",
	apiKey: process.env.GOOGLE_API_KEY,
});
