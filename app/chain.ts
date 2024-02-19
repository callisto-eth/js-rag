import { vectorStore, llm } from ".";
import SystemPrompt from "./config/systemprompt";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	RunnablePassthrough,
	RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { SystemMessagePromptTemplate } from "@langchain/core/prompts"

const prompt = SystemMessagePromptTemplate.fromTemplate(SystemPrompt);

const chain = RunnableSequence.from([
    {
        context: vectorStore.asRetriever().pipe(formatDocumentsAsString),
        query: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
])

export default chain;