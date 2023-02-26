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

export const PUT: RequestHandler = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		// the user is not signed in
		throw error(403, { message: 'Unauthorized' });
	}

	const privateProfileData = await event.request.json();

	// Save the profile updates or remove the profile if there is no data
	const { error: dbError } =
		Object.keys(privateProfileData).length === 0
			? await supabaseClient.from('profiles_private').delete().eq('id', session.user.id)
			: await supabaseClient
					.from('profiles_private')
					.upsert({ ...privateProfileData, id: session.user.id });

	if (dbError) {
		throw fail(500, {
			supabaseErrorMessage: dbError.message
		});
	}

	return json({ success: true });
};
