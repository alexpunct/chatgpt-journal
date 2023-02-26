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

	// Get the private profile for the current user
	const fetchPrivateProfileResponse = await event.fetch('/api/userProfile/private');
	if (fetchPrivateProfileResponse.status !== 200) {
		throw fail(500, {
			error: 'Could not fetch private profile details'
		});
	}

	// Call the embeddings function to create the embeddings for all journal entries
	const privateProfile = await fetchPrivateProfileResponse.json();
	const { error: functionError } = await supabaseClient.functions.invoke(
		'create-embeddings-for-all',
		{
			body: { name: 'Functions', customOpenAiKey: privateProfile?.openai_api_key }
		}
	);
	if (functionError && functionError.context.status === 401) {
		throw error(401, { message: 'OpenAI API Error. Please make sure your API Key is correct.' });
	}

	return json({ success: true });
};
