// utilities
import { supabase } from '$lib/supabaseClient';

// types
import type { PageLoad } from './$types';
import type { Profile, ProfilePrivate } from '$lib/types';

// @TODO move the private profile to the server
export const load: PageLoad = async ({ parent, depends }) => {
	const result: {
		error: string;
		profile: Profile;
		profilePrivate: ProfilePrivate;
	} = {
		error: '',
		profile: {},
		profilePrivate: {}
	};

	const { session } = await parent();

	if (!session) return result;

	depends('app:profile');

	try {
		const { user } = session;
		result.profile.id = user.id;
		result.profile.email = user.email;

		const { data, error, status } = await supabase
			.from('profiles')
			.select(`full_name, avatar_url, profiles_private (*)`)
			.eq('id', user.id)
			.single();

		if (error && status !== 406) throw error;

		result.profile.full_name = data?.full_name;
		result.profile.avatar_url = data?.avatar_url;
		const privateProfileData = data?.profiles_private;
		if (privateProfileData) {
			result.profilePrivate.openai_api_key = privateProfileData.openai_api_key;
		}
	} catch (error) {
		if (error instanceof Error) {
			result.error = error.message;
		}
	}

	return result;
};
