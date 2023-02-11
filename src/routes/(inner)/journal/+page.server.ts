import { supabase } from '$lib/supabaseClient';
import { generateEmbeddings, insertDocuments } from '$lib/openai';

export async function load() {
	const { data } = await supabase.from('journal_alex').select();
	return {
		journal_alex: data ?? []
	};
}
