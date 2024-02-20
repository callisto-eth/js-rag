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

export const VectorStore = new VectorChunkStore();
export const LLM = new GeminiLLM();

const prompt = SystemMessagePromptTemplate.fromTemplate(SystemPrompt);
const contextualizerPrompt =
	SystemMessagePromptTemplate.fromTemplate(Contextualizer);

function contextualizeCtxString(ctx: string): string {
	console.log(`IN: ${ctx}`)
	ContextualizerChain.invoke(ctx).then((out) => {
		console.log(`OUT: ${out}`)
		return out;
	});
	return "";
}

export const Chain = RunnableSequence.from([
	{
		context: VectorStore.asRetriever(3)
			.pipe(formatDocumentsAsString)
			.pipe(contextualizeCtxString),
		query: new RunnablePassthrough(),
	},
	prompt,
	LLM,
	new StringOutputParser(),
]);

export const ContextualizerChain = RunnableSequence.from([
	{
		input: new RunnablePassthrough(),
	},
	contextualizerPrompt,
	LLM,
	new StringOutputParser(),
]);
