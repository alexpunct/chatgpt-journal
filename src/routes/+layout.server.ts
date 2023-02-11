import type { LayoutServerLoad } from './$types';
import { VERCEL_ENV } from '$env/static/private';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
	// auth session
	const session = await getServerSession(event);

	let theme = event.cookies.get('theme');
	// If no theme, set theme to chatjournal
	if (!theme) {
		event.cookies.set('theme', 'chatjournal', { path: '/' });
		theme = 'chatjournal';
	}
	// Imports theme as a string
	const modules = import.meta.glob(`$lib/themes/*.css`, { as: 'raw' });
	return {
		currentTheme: modules[`/src/lib/themes/theme-${theme}.css`](),
		vercelEnv: VERCEL_ENV,
		session
	};
};
