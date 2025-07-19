import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	
	// If user is not authenticated, redirect to signin
	if (!session) {
		throw redirect(307, '/auth/signin');
	}
	
	// If user is authenticated, redirect to their journal
	throw redirect(307, '/journal');
};