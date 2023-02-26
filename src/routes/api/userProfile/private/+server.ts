import { error, fail, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// types
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event: RequestEvent) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		// the user is not signed in
		throw error(403, { message: 'Unauthorized' });
	}

	const {
		data,
		error: dbError,
		status
	} = await supabaseClient.from('profiles_private').select(`*`).eq('id', session.user.id).single();

	if (dbError && status !== 406)
		throw fail(500, {
			error: dbError.message
		});

	return json({ data, success: true });
};
