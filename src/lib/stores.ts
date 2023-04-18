import { writable, type Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';

// types
import type { Database } from '$lib/types/supabaseTypes';
import type { Message, ChatModel } from '$lib/types/chatTypes';

// Svelte Writable Stores ---

// Set within root layout, persists current SvelteKit $page.url.pathname
export const storeCurrentUrl: Writable<string | undefined> = writable(undefined);
export const userProfile: Writable<Database['public']['Tables']['profiles']['Row'] | undefined> =
	writable(undefined);

// Local Storage Stores ---

// Persists select preset theme
export const storeTheme: Writable<string> = localStorageStore('storeTheme', 'chatjournal');

// Persists the tab selection for the user's preferred framework
export const storeFramework: Writable<string> = localStorageStore('storeFramework', 'sveltekit');

// Persist the user conversation
export const userConversation: Writable<Message[] | []> = localStorageStore('userConversation', [
	{
		role: 'assistant',
		content: 'Welcome to Chat Journal! What do you want to talk about?',
		time: new Date()
	}
]);

export const activeModel: Writable<ChatModel> = localStorageStore('activeModel', 'gpt-3.5-turbo');
export const activeAgent: Writable<string> = localStorageStore('activeAgent', '1');
