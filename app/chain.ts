import { SystemPrompt, Contextualizer } from "./config/PromptTemplates";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { VectorChunkStore } from "./db/Astra";
import { GeminiLLM } from "./llm/Gemini";

// export const VectorStore = new VectorChunkStore();
export const LLM = new GeminiLLM();

const prompt = SystemMessagePromptTemplate.fromTemplate(SystemPrompt);
const contextualizerPrompt =
	SystemMessagePromptTemplate.fromTemplate(Contextualizer);

function printCTX(ctx: string) {
	console.log(`CTX ======> ${ctx}`);
	return ctx;
}

export const ContextualizerChain: RunnableSequence = RunnableSequence.from([
	{
		input: VectorChunkStore.Instance.asRetriever(5).pipe(formatDocumentsAsString),
	},
	contextualizerPrompt,
	LLM,
	new StringOutputParser(),
]);

export const Chain = RunnableSequence.from([
	{
		context: ContextualizerChain.pipe(printCTX),
		query: new RunnablePassthrough(),
	},
	prompt,
	LLM,
	new StringOutputParser(),
]);
