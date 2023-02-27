import { error, fail, json } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// types
import type { RequestHandler, RequestEvent } from './$types';

export const GET: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		throw error(403, { message: 'Unauthorized' });
	}

	const query = supabaseClient
		.from('journal')
		.select('content, day, id', { count: 'exact' })
		.eq('user_id', session.user.id)
		// .range(from, to)
		.order('day', { ascending: false });
	// .limit(paginationSettings.limit);

	// if (search) query.ilike('content', `%${search}%`);

	try {
		const res = await query;

		const { count, data, error, status } = res;

		if (error && status !== 406) throw error;
		return json({ data, count });
	} catch (e) {
		if (e instanceof Error) {
			console.error(e);
			throw error(500, e.message);
		}
	}
	return json({ success: true });
};

export const POST: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		// the user is not signed in
		throw error(403, { message: 'Unauthorized' });
	}

	const { id, day, content } = await event.request.json();

	// make sure we have the content
	if (!content) {
		throw error(400, { message: 'Missing content' });
	}

	// if the id is set, updates go through PATCH
	if (id) {
		return PATCH(event);
	}

	// save the journal entry
	const supabaseInsertResponse = await supabaseClient
		.from('journal')
		.insert({
			user_id: session.user.id,
			day: day || new Date().toISOString().split('T')[0],
			content
		})
		.select();

	if (supabaseInsertResponse.error) {
		throw fail(500, {
			supabaseErrorMessage: supabaseInsertResponse.error.message
		});
	}

	_saveJournalEntrySuccessAfterHook(event);

	return json({ success: true, data: supabaseInsertResponse.data });
};

export const PATCH: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		// the user is not signed in
		throw error(403, { message: 'Unauthorized' });
	}

	const { id, content, embedding } = await event.request.json();

	// if the id is set, throw an error because updates go through PATCH
	if (!id) {
		throw error(400, { message: 'Id is missing id' });
	}

	// make sure we have the content
	if (!content) {
		throw error(400, { message: 'Missing content' });
	}

	//update the entry
	const supabaseUpdateResponse = await supabaseClient
		.from('journal')
		.update({
			user_id: session.user.id,
			...(embedding ? { embedding } : {}),
			content
		})
		.eq('id', id);

	if (supabaseUpdateResponse.error) {
		throw fail(500, {
			supabaseErrorMessage: supabaseUpdateResponse.error.message
		});
	}

	_saveJournalEntrySuccessAfterHook(event);

	return json({ success: true });
};

/**
 * Hook for after a journal entry is saved
 * @param {RequestEvent} event
 */
const _saveJournalEntrySuccessAfterHook = async (event: RequestEvent) => {
	// Create embeddings async
	event.fetch('/api/journal/embeddings', {
		method: 'POST'
	});
};
