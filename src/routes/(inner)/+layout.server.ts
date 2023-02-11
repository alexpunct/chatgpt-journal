import { redirect } from '@sveltejs/kit';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

// types
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);
	if (!session) throw redirect(307, '/auth/signin');

	return {
		session
	};
};
