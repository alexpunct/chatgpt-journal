import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;

		// Prepare the form data
		const formData = await request.formData();
		const saveData: {
			content: FormDataEntryValue | null;
			id?: FormDataEntryValue | null;
		} = {
			content: formData.get('content'),
			...(formData.has('id') ? { id: formData.get('id') } : {})
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
