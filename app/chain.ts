import { SystemPrompt, Contextualizer } from "./config/PromptTemplates";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	RunnablePassthrough,
	RunnableSequence,
	RunnableParallel,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { VectorChunkStore } from "./db/Astra";
import { GeminiLLM } from "./llm/Gemini";

export const VectorStore = new VectorChunkStore();
export const LLM = new GeminiLLM();

const prompt = SystemMessagePromptTemplate.fromTemplate(SystemPrompt);
const contextualizerPrompt =
	SystemMessagePromptTemplate.fromTemplate(Contextualizer);

function printctx(ctx: string) {
	console.log(ctx)
}

export const ContextualizerChain: RunnableSequence = RunnableSequence.from([
	{
		input: VectorStore.asRetriever(3)
			.pipe(formatDocumentsAsString)
	},
	contextualizerPrompt,
	LLM,
	new StringOutputParser(),
]);

export const Chain = RunnableSequence.from([
	{
		context: ContextualizerChain.pipe(printctx),
		query: new RunnablePassthrough(),
	},
	prompt,
	LLM,
	new StringOutputParser(),
]);
