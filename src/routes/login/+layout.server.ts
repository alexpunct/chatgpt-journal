import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);
	if (session) {
		throw redirect(307, '/profile');
	}
	return {};
};
