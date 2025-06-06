import '$lib/supabaseClient';

// In newer versions of SvelteKit a `handleError` hook is expected on the
// client. Without this export the build fails when `app` tries to import it.
export const handleError = ({ error }: { error: unknown }) => {
	console.error(error);
};
