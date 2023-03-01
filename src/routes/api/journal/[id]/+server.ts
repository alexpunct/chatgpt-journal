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
		let query = supabaseClient
			.from('journal')
			.select(`id, day, content, embedding`)
			.eq('user_id', session?.user.id);
		if (id === 'today') {
			query = query.eq('day', new Date().toISOString().split('T')[0]);
		} else {
			query = query.eq('id', id);
		}
		const { data, error, status } = await query.single();

		if (error && status !== 406) throw error;
		return json(data || {});
	} catch (e) {
		if (e instanceof Error) {
			console.error(e);
			throw error(500, e.message);
		}
	}
	return json({ success: true });
};

export const DELETE: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw error(403, { message: 'Unauthorized' });
	}

	const id = event.params.id;

	try {
		const { error, status } = await supabaseClient
			.from('journal')
			.delete()
			.eq('id', id)
			.eq('user_id', session.user.id)
			.single();

		if (error && status !== 406) throw error;
	} catch (e) {
		if (e instanceof Error) {
			console.error(e);
			throw error(500, e.message);
		}
	}
	return json({ success: true });
};
