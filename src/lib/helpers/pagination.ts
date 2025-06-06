export const supabasePaginationDefaults = {
	limit: 5,
	offset: 0,
	amounts: [1, 5, 20]
};

/**
 * Calculate the range for Supabase queries using an offset and limit.
 * @param {number} offset - Zero based starting index.
 * @param {number} limit - Amount of records to fetch.
 */
export const getFromTo = (offset: number, limit: number) => {
	const _limit = isNaN(limit) ? supabasePaginationDefaults.limit : +limit;
	const from = isNaN(offset) ? supabasePaginationDefaults.offset : offset;
	const to = from + _limit - 1;

	return { from, to };
};
