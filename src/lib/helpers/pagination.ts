export const supabasePaginationDefaults = {
	limit: 5,
	offset: 0,
	amounts: [1, 5, 20]
};

export const getFromTo = (page: number, size: number) => {
	const limit = size ? +size : supabasePaginationDefaults.limit;
	const from = page ? page * limit : supabasePaginationDefaults.offset;
	const to = page ? from + size : size;

	return { from, to };
};
