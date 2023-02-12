// src/routes/+layout.ts
import type { LayoutLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async (event) => {
	const { session } = await getSupabase(event);

	event.data.session = session;

	return event.data;
};
