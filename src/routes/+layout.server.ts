import type { LayoutServerLoad } from './$types';
import { VERCEL_ENV } from '$env/static/private';

export const load: LayoutServerLoad = async ({ cookies }) => {
	let theme = cookies.get('theme');
	// If no theme, set theme to chatjournal
	if (!theme) {
		cookies.set('theme', 'chatjournal', { path: '/' });
		theme = 'chatjournal';
	}
	// Imports theme as a string
	const modules = import.meta.glob(`../lib/themes/*.css`, { as: 'raw' });
	return { currentTheme: modules[`../lib/themes/theme-${theme}.css`](), vercelEnv: VERCEL_ENV };
};
