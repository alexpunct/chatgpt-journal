import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutServerLoad = async (event) => {
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
		session: await getServerSession(event)
	};
};
