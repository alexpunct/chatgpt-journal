import { error } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { json, redirect } from '@sveltejs/kit';

// types
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw redirect(303, '/');
	}
	const id = event.params.id;
	try {
		const { data, error, status } = await supabaseClient
			.from('journal')
			.select(`id, day, content, embedding`)
			.eq('user_id', session?.user.id)
			.eq('day', id === 'today' ? new Date().toISOString().split('T')[0] : id)
			.single();

		if (error && status !== 406) throw error;
		return json(data);
	} catch (e) {
		if (e instanceof Error) {
			console.error(e);
			throw error(500, e.message);
		}
	}
	return json({ success: true });
};
