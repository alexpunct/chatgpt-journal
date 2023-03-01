import type { PageServerLoad } from './$types';
import { supabasePaginationDefaults } from '$lib/helpers/pagination';

export const load: PageServerLoad = async ({ fetch, depends, url }) => {
	// Build the query string
	const offset = url.searchParams.get('offset') || supabasePaginationDefaults.offset;
	const limit = url.searchParams.get('limit') || supabasePaginationDefaults.limit;
	const search = url.searchParams.get('q') || '';

	const response = await fetch(`/api/journal?offset=${offset}&limit=${limit}&q=${search}`);
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
