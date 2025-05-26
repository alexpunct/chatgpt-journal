// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import 'xhr_polyfill';
import { serve } from 'std/server';
import { corsHeaders } from '../_shared/cors.ts';

import { createClient } from '@supabase/supabase-js';
import { Configuration, OpenAIApi, CreateChatCompletionRequest } from 'openai';
import GPT3Tokenizer from 'gpt3-tokenizer';
import { stripIndent, oneLine } from 'common-tags';

let defaultOpenAiKey = Deno.env.get('OPENAI_API_KEY');
const DEFAULT_CHAT_MODEL = 'gpt-4.1-nano';

import agents from './agents.json' assert { type: 'json' };
const getAgentByAgentId = (agentId: string) => {
	const agent = agents.find((agent) => agent.id === agentId);
	if (!agent) {
		return agents[0];
	}
	return agent;
};

// Define a type for the conversation message
interface Message {
	role: string;
	content: string;
}

/**
 *
 * @export
 * @interface ChatCompletionRequestMessage
 */
export interface ChatCompletionRequestMessage {
	/**
	 * The role of the author of this message.
	 * @type {string}
	 * @memberof ChatCompletionRequestMessage
	 */
	role: ChatCompletionRequestMessageRoleEnum;
	/**
	 * The contents of the message
	 * @type {string}
	 * @memberof ChatCompletionRequestMessage
	 */
	content: string;
	/**
	 * The name of the user in a multi-user chat
	 * @type {string}
	 * @memberof ChatCompletionRequestMessage
	 */
	name?: string;
}

export const ChatCompletionRequestMessageRoleEnum = {
	System: 'system',
	User: 'user',
	Assistant: 'assistant'
} as const;

export type ChatCompletionRequestMessageRoleEnum =
	(typeof ChatCompletionRequestMessageRoleEnum)[keyof typeof ChatCompletionRequestMessageRoleEnum];

/**
 * Generate embeddings for string
 * @param content the content
 * @returns number[] the embedding
 */
export const generateEmbeddings = async (openAi: OpenAIApi, content: string) => {
	const input = content?.replace(/\n/g, ' ');
	if (!input) {
		throw new Error('No content provided');
	}

	if (!openAi) {
		throw new Error('OpenAI API key not set');
	}

	const embeddingResponse = await openAi.createEmbedding({
		model: 'text-embedding-ada-002',
		input
	});

	const [{ embedding }] = embeddingResponse.data.data;
	return embedding;
};

const fetchSimilarEntries = async (
	openAi: OpenAIApi,
	supabaseClient: any,
	query: string
): Promise<string[]> => {
	const journalEntries: string[] = [];

	// Generate a one-time embedding for the query itself
	const query_embedding = await generateEmbeddings(openAi, query);

	// In production we should handle possible errors
	const { data: similar_entries } = await supabaseClient.rpc('match_entries', {
		query_embedding,
		similarity_threshold: 0.78, // Choose an appropriate threshold for your data
		match_count: 3 // Choose the number of matches
	});

	const tokenizer = new GPT3Tokenizer({ type: 'gpt3' });
	let tokenCount = 0;

	// Concat matched documents
	if (similar_entries && similar_entries.length > 0) {
		for (let i = 0; i < similar_entries.length; i++) {
			const document = similar_entries[i];
			const content =
				'Journal entry from ' + document.entry_day + '; \n Content: ' + document.content + ';\n';
			const encoded = tokenizer.encode(content);
			tokenCount += encoded.text.length;

			// Limit context to max 1500 tokens (configurable)
			if (tokenCount > 1500) {
				break;
			}

			journalEntries.push(`${content.trim()}`);
		}
	}

	return journalEntries as string[];
};

serve(async (req: Request) => {
	// This is needed if you're planning to invoke your function from a browser.
	if (req.method === 'OPTIONS') {
		return new Response('ok', { headers: corsHeaders });
	}

	try {
		// Search query is passed in request payload
		let {
			query,
			conversationHistory,
			temperature,
			activeModel = DEFAULT_CHAT_MODEL,
			agentId = '1'
		} = await req.json();

		if (!query) {
			throw new Error('No query provided');
		}

		// Create a Supabase client with the Auth context of the logged in user.
		const supabaseClient = createClient(
			// Supabase API URL - env var exported by default.
			Deno.env.get('SUPABASE_URL') ?? '',
			// Supabase API ANON KEY - env var exported by default.
			Deno.env.get('SUPABASE_ANON_KEY') ?? '',
			// Create client with Auth context of the user that called the function.
			// This way your row-level-security (RLS) policies are applied.
			{ global: { headers: { Authorization: req.headers.get('Authorization')! } } }
		);

		const usr = await supabaseClient.auth.getUser();

		// Now we can get the session or user object
		const {
			data: { user }
		} = usr;

		if (!user || !user.id) {
			console.log('No user found', usr);
			throw new Error('No user found');
		}

		const fetchPrivateProfileResponse = await supabaseClient
			.from('profiles_private')
			.select(`openai_api_key`)
			.eq('id', user.id)
			.single();

		let openAiKey = defaultOpenAiKey;
		if (
			fetchPrivateProfileResponse.status === 200 &&
			fetchPrivateProfileResponse.data?.openai_api_key
		) {
			openAiKey = fetchPrivateProfileResponse.data.openai_api_key;
		} else {
			activeModel = DEFAULT_CHAT_MODEL;
		}

		const openAi = new OpenAIApi(new Configuration({ apiKey: openAiKey }));

		const agent = getAgentByAgentId(agentId);
		const prompt = stripIndent`${oneLine`
    ${agent.prompt}`}
  `;
		// order the messages like this:
		// 1 - the prompt
		// 2 - the conversation history
		// 3 - the journal entry matching the current query
		// 4 - the query

		const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: prompt }];

		// Add the conversation history to the prompt
		if (conversationHistory && conversationHistory.length > 0) {
			conversationHistory.forEach((message: ChatCompletionRequestMessage) => {
				messages.push({ role: message.role, content: message.content });
			});
		}

		// Get similar entries from the database
		const similarEntries = await fetchSimilarEntries(openAi, supabaseClient, query);
		// Add the similar entries to the prompt
		if (similarEntries && similarEntries.length > 0) {
			similarEntries.forEach((message) => {
				messages.push({ role: 'user', content: message });
			});
		}

		// Add the query to the prompt
		messages.push({ role: 'user', content: query });

		// // In production we should handle possible errors
		const completionOptions: CreateChatCompletionRequest = {
			model: activeModel,
			messages,
			max_tokens: activeModel === DEFAULT_CHAT_MODEL ? 300 : 600, // Choose the max allowed tokens in completion
			temperature: temperature || agent.temperature, // Set to 0 for deterministic results
			// top_p: 0.1,
			stream: true,
			user: user.id
		};

		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			headers: {
				Authorization: `Bearer ${openAiKey}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(completionOptions)
		});

		if (!response.ok) {
			throw new Error('Failed to complete');
		}

		// Proxy the streamed SSE response from OpenAI
		return new Response(response.body, {
			headers: {
				...corsHeaders,
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			headers: { ...corsHeaders, 'Content-Type': 'application/json' },
			status: 400
		});
	}
});

console.log(`Function "chat-stream" up and running!`);
