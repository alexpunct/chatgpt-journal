// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, parent }) => {
	const response = await fetch('/api/journal/today');
	const journalEntry = await response.json();

	if (response.status === 200) {
		return {
			journalEntry,
			parentData: await parent()
		};
	}
	return { status: 406 };
};
