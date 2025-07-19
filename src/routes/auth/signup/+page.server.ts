import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { getSupabase, getServerSession } from '@supabase/auth-helpers-sveltekit';
import { AuthApiError } from '@supabase/supabase-js';

export const load: PageServerLoad = async (event) => {
	const session = await getServerSession(event);
	
	// If user is already authenticated, redirect to journal
	if (session) {
		throw redirect(307, '/journal');
	}
	
	// Otherwise, redirect to signin (no new signups allowed)
	throw redirect(307, '/auth/signin');
};

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;
		const { supabaseClient } = await getSupabase(event);
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { data, error } = await supabaseClient.auth.signUp({
			email,
			password
		});

		if (error) {
			if (error instanceof AuthApiError && error.status === 400) {
				return fail(400, {
					error: 'Invalid credentials.',
					values: {
						email
					}
				});
			}
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			});
		}

		return { success: true };
	}
};
