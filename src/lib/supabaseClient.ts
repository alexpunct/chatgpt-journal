import { createClient } from '@supabase/auth-helpers-sveltekit';
import { SSE } from 'sse.js';

import type { ChatModel, Message } from '$lib/types/chatTypes';

// Provide sane defaults so that the app can start even if the environment
// variables are missing (for example when running tests). `createClient`
// throws if it receives empty strings, so fall back to local values.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseFunctionsUrl =
	import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || 'http://localhost:54321/functions/v1';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createEventSource = async (
	query: string,
	activeModel: ChatModel,
	agentId: string,
	conversationHistory: Message[] = []
) => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (!session) {
		throw new Error('You must be logged in to use this feature');
	}

	const eventSource = new SSE(`${supabaseFunctionsUrl}/chat-stream`, {
		headers: {
			Authorization: `Bearer ${session?.access_token}`,
			'Content-Type': 'application/json'
		},
		payload: JSON.stringify({
			query,
			conversationHistory,
			activeModel,
			agentId,
			temperature: 0
		})
	});
	return eventSource;
};
