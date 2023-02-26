import { userProfile } from '$lib/stores';

// types
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
	if (event.data.session) {
		// If logged in, fetch the user profile
		event.depends('app:profile');
		const fetchPrivateProfileResponse = await event.fetch('/api/userProfile/public');
		if (fetchPrivateProfileResponse.status === 200) {
			const publicUserProfile = await fetchPrivateProfileResponse.json();
			// Set the user profile on the store
			userProfile.set(publicUserProfile?.data);

			// Return the layout data and the public user profile
			return { publicUserProfile: publicUserProfile?.data, ...event.data };
		}
	}

	// Return the layout data and the public user profile
	return { ...event.data };
};
