import SystemPrompt from "./config/SystemPrompt";
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

function formatCtxString(ctx:string) {
    console.log(ctx)
    return ctx
}

const Chain = RunnableSequence.from([
	{
		context: VectorStore.asRetriever(3).pipe(
			formatDocumentsAsString
		).pipe(formatCtxString),
		query: new RunnablePassthrough(),
	},
	prompt,
	LLM,
	new StringOutputParser(),
]);



export default Chain;
