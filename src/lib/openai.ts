import { Configuration, OpenAIApi } from 'openai';
import { supabaseClient } from '$lib/supabaseClient';
import { OPENAI_API_KEY } from '$env/static/private';

const EMBEDDINGS_MODEL = 'text-embedding-ada-002';

/**
 * Generate embeddings for string
 * @param content the content
 * @returns number[] the embedding
 */
export const generateEmbeddings = async (content: string) => {
	const input = content?.replace(/\n/g, ' ');
	if (!input) {
		throw new Error('No content provided');
	}
	const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
	const openAi = new OpenAIApi(configuration);

	const embeddingResponse = await openAi.createEmbedding({ model: EMBEDDINGS_MODEL, input });

	const [{ embedding }] = embeddingResponse.data.data;
	return embedding;
};

export const insertDocuments = async (data: [{ content: string; date: Date }]) => {
	// const { data } = await supabase.from('journal_alex').select();

	if (!data) {
		console.log('No data found');
		return;
	}

	// Assuming each document is a string
	for (const document of data) {
		try {
			const embedding = await generateEmbeddings(document.content);

			// In production we should handle possible errors
			await supabaseClient.from('journal_alex').insert({
				content: document.content,
				date: document.date,
				embedding
			});
		} catch (error) {
			console.error(`Cannot create documents: ${error}`);
		}
	}
};
