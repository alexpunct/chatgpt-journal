import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, depends }) => {
	const response = await fetch('/api/journal');
	const { data: journalEntries, count } = await response.json();

	depends('journal:list');

	if (response.status === 200) {
		return {
			journalEntries,
			count
		};
	}
	return { status: 406 };
};
