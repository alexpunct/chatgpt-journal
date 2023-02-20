// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
/// <reference types="@sveltejs/kit" />
declare namespace App {
	// interface Locals {}
	// interface Error {}
	// interface Platform {}
	interface Supabase {
		Database: import('./lib/types/supabaseTypes').Database;
		SchemaName: 'public';
	}

	// interface Locals {}
	interface PageData {
		session: import('@supabase/supabase-js').Session | null;
	}
}

declare module 'sse.js' {
	export type SSEOptions = EventSourceInit & {
		headers?: Record<string, string>;
		payload?: string;
		method?: string;
	};

	export class SSE extends EventSource {
		constructor(url: string | URL, sseOptions?: SSEOptions);
		stream(): void;
	}
}
