import { error, fail, json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

// types
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event: RequestEvent) => {
	const { session, supabaseClient } = await getSupabase(event);
	if (!session) {
		// the user is not signed in
		throw error(403, { message: 'Unauthorized' });
	}

	const {
		data,
		error: dbError,
		status
	} = await supabaseClient
		.from('profiles_private')
		.select(`openai_api_key`)
		.eq('id', session.user.id)
		.single();

	if (dbError && status !== 406)
		throw fail(500, {
			error: dbError.message
		});

	const { error: functionError } = await supabaseClient.functions.invoke(
		'create-embeddings-for-all',
		{
			body: { name: 'Functions', customOpenAiKey: data?.openai_api_key }
		}
	);

	if (functionError && functionError.context.status === 401) {
		throw error(401, { message: 'OpenAI API Error. Please make sure your API Key is correct.' });
	}

	return json({ success: true });
};
