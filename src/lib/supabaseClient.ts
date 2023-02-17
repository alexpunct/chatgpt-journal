import { createClient } from '@supabase/auth-helpers-sveltekit';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPagination = (page: number, size: number) => {
	const limit = size ? +size : 5;
	const from = page ? page * limit : 0;
	const to = page ? from + size : size;

	return { from, to };
};
