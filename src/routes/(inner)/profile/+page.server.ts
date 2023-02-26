import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async (event) => {
		const { request } = event;
		const formData = await request.formData();

		// Save the public profile
		const { status: savePublicStatus } = await event.fetch('/api/userProfile/public', {
			method: 'PUT',
			body: JSON.stringify({
				full_name: formData.get('full_name'),
				avatar_url: formData.get('avatar_url')
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		// Save the private profile
		const { status: savePrivateStatus } = await event.fetch('/api/userProfile/private', {
			method: 'PUT',
			body: JSON.stringify({
				openai_api_key: formData.get('openai_api_key')
			}),
			headers: {
				'content-type': 'application/json'
			}
		});

		// Return the response
		if (savePublicStatus !== 200 || savePrivateStatus !== 200) {
			return fail(500, {
				error: 'Unexpected error saving the profile.'
			});
		}

		return { success: true };
	}
};
