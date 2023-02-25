<script lang="ts">
	// Utilities
	import { enhance } from '$app/forms';

	// Components
	import { ProgressRadial, focusTrap, toastStore } from '@skeletonlabs/skeleton';

	// Types
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { Database } from '$lib/types/supabaseTypes';

	// Props
	export let journalEntry: Database['public']['Tables']['journal']['Row'];

	// Local
	let loading = false;

	const t: ToastSettings = {
		message: '',
		timeout: 2000
	};
</script>

<div class="edit-journal-entry">
	<form
		method="POST"
		use:enhance={() => {
			toastStore.clear();
			loading = true;
			return async ({ result }) => {
				if (result.status === 200) {
					toastStore.trigger({
						...t,
						background:
							'bg-gradient-to-tr from-success-900 via-success-700 to-success-500 text-black',
						message: `Saved successfully!`
					});
				} else {
					toastStore.trigger({
						...t,
						message: `Unexpected error, please try again later...`
					});
				}
				loading = false;
			};
		}}
	>
		<!-- Header -->
		<header class="text-center p-4">
			<h4 class="text-tertiary-700">
				<i class="fa-solid fa-calendar-alt text-lg mr-2" />
				{new Date().toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric'
				})}
			</h4>
		</header>
		<!-- Body -->
		<div class="p-0 md:p-3 space-y-4">
			{#if journalEntry?.id}
				<input type="hidden" name="id" value={journalEntry?.id} />
			{/if}
			<textarea
				name="content"
				use:focusTrap={true}
				class="textarea text-justify leading-5 tracking-wide max-h-60 md:max-h-max pb-4"
				required
				rows="19">{journalEntry?.content}</textarea
			>
			<div class="text-center w-full pointer-events-none">
				{#if loading}
					<div class="flex justify-center p-1 pb-1.5">
						<div class="w-8">
							<ProgressRadial
								stroke={150}
								meter="stroke-primary-500"
								track="stroke-primary-500/30"
							/>
						</div>
					</div>
				{:else}
					<button
						class="btn variant-filled-primary card-hover shadow md:opacity-60 hover:opacity-100 pointer-events-auto"
						>Save</button
					>
				{/if}
			</div>
		</div>
	</form>
</div>
