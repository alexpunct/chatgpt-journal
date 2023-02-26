<script lang="ts">
	// Utilities
	import { enhance } from '$app/forms';
	import { successToast, errorToast } from '$lib/helpers/triggerToast';
	import { invalidate } from '$app/navigation';

	// Components
	import EditFormFields from '$lib/components/Journal/EditFormFields.svelte';

	// Types
	import type { Database } from '$lib/types/supabaseTypes';

	// Props
	export let journalEntry: Database['public']['Tables']['journal']['Row'];

	// Local
	let loading = false;
</script>

<div class="edit-journal-entry">
	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				if (result.status === 200) {
					successToast(`Saved successfully!`);
					invalidate('journal:today');
				} else {
					errorToast(`Unexpected error, please try again later...`);
				}
				loading = false;
			};
		}}
	>
		<!-- Header -->
		<header class="text-center p-4">
			<h4 class="gradient-heading">
				<i class="fa-solid fa-calendar-alt text-lg mr-2" />
				{new Date().toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</h4>
		</header>
		<EditFormFields {journalEntry} {loading} />
	</form>
</div>
