// types
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/journal/today');
	const journalEntry = await response.json();

	if (response.status === 200) {
		return {
			journalEntry
		};
	}
	return { status: 406 };
};
