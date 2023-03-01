import { fail } from '@sveltejs/kit';

// types
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, depends, params }) => {
	// if it's a new entry we don't need to fetch anything
	if (!params.id || params.id === 'new') {
		return {
			status: 200
		};
	}

	// fetch the entry (by id or the current day)
	const response = await fetch('/api/journal/' + (params.id || 'today'));
	const journalEntry = await response.json();

	depends('journal:today');

	if (response.status === 200) {
		return {
			journalEntry
		};
	}
	return { status: 406 };
};

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;

		// Prepare the form data
		const formData = await request.formData();
		const saveData: {
			content: FormDataEntryValue | null;
			id?: FormDataEntryValue | null;
			day?: FormDataEntryValue | null;
		} = {
			content: formData.get('content'),
			...(formData.has('id') ? { id: formData.get('id') } : {}), // only include if it's an update
			...(formData.has('day') ? { day: formData.get('day') } : {}) // only include if it's a new entry
		};

		if (!saveData.content) {
			return fail(400, {
				error: 'Content is required.'
			});
		}

		// Call the API
		const response = await event.fetch('/api/journal', {
			method: saveData.id ? 'PATCH' : 'POST',
			body: JSON.stringify(saveData),
			headers: {
				'content-type': 'application/json'
			}
		});

		// Return the response
		if (response.status === 200) {
			return { success: true };
		}

		return fail(500, {
			error: 'Could not save the entry...'
		});
	}
};
