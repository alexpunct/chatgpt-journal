import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { userProfile } from '$lib/stores';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const { session, supabaseClient } = await getSupabase(event);

	event.data.session = session;

	if (session) {
		event.depends('app:profile');
		try {
			const { data, error, status } = await supabaseClient
				.from('profiles')
				.select(`*`)
				.eq('id', session.user.id)
				.single();

			if (error && status !== 406) throw error;

			userProfile.set(data?.id ? data : undefined);
		} catch (error) {
			console.error(`Error fetching profile: ${error}`);
		}
	}

	return event.data;
};
