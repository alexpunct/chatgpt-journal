import { redirect } from '@sveltejs/kit';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	const { session } = await event.parent();
	if (!session) {
		throw redirect(307, '/');
	}
	return { session };
};
