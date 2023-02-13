import { writable, type Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Database } from '$lib/supabaseTypes';

// types
// import type { Profile } from '$lib/types';

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
