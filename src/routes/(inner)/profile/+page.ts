// utilities
// types
import type { PageLoad } from './$types';

// @TODO move the private profile to the server
export const load: PageLoad = async ({ depends, fetch }) => {
	depends('userProfile:private');
	const fetchPrivateProfileResponse = await fetch('/api/userProfile/private');
	if (fetchPrivateProfileResponse.status === 200) {
		return {
			userProfilePrivate: (await fetchPrivateProfileResponse.json()).data
		};
	}

	return {};
};
