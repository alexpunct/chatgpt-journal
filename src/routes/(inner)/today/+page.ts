// utilities
import { supabase } from '$lib/supabaseClient';

// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, depends }) => {
	const { session } = await parent();

	if (!session) return { redirect: { destination: '/auth/signin', permanent: false } };

	depends('journal:today');

	try {
		const { data, error, status } = await supabase
			.from('journal')
			.select(`id, day, content`)
			.eq('user_id', session.user.id)
			.eq('day', new Date().toISOString().split('T')[0])
			.single();

		if (error && status !== 406) throw error;

		return {
			savedEntry: data
		};
	} catch (error) {
		if (error instanceof Error) {
			console.error(error);
		}
	}

	return { status: 406 };
};
