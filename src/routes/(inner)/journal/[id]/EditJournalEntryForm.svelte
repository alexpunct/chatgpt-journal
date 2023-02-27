<script lang="ts">
	// Utilities
	import { enhance } from '$app/forms';
	import { successToast, errorToast } from '$lib/helpers/triggerToast';
	import { invalidate } from '$app/navigation';

	// Components
	import { ProgressRadial, focusTrap } from '@skeletonlabs/skeleton';

	// Types
	import type { Database } from '$lib/types/supabaseTypes';

	// Props
	export let journalEntry: Database['public']['Tables']['journal']['Row'];

	// Local
	let loading = false;

	let textareaContent = journalEntry.content || '';
	let textareaMinRows = 5;
	let textareaMaxRows = 20; // @TODO remove this and save automatically after typing with debounce
	$: minHeight = `${1 + textareaMinRows * 1.2}em`;
	$: maxHeight = textareaMaxRows ? `${1 + textareaMaxRows * 1.2}em` : `auto`;
</script>

<div class="edit-journal-entry">
	<form
		method="POST"
		use:focusTrap={true}
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
			<h2 class="gradient-heading">
				<i class="fa-solid fa-calendar-alt text-lg mr-2" />
				{new Date().toLocaleDateString('en-US', {
					weekday: 'long',
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</h2>
		</header>

		<!-- Form fields -->
		<div class="p-0 md:p-3">
			<div class="relative">
				<pre
					class="invisible"
					aria-hidden="true"
					style="min-height: {minHeight}; max-height: {maxHeight}">{textareaContent + '\n\n'}</pre>
				<textarea
					bind:value={textareaContent}
					name="content"
					placeholder="How are you feeling?"
					class="textarea text-xl leading-5 tracking-wide !overflow-y-auto !bg-transparent !border-none !outline-none resize-none"
					required
					rows="5"
				/>
			</div>
			{#if journalEntry?.id}
				<input type="hidden" name="id" value={journalEntry?.id} class="hidden" />
			{/if}
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
					<button class="btn mt-4 min-w-[150px] pointer-events-auto btn-gradient-primary"
						>Save</button
					>
				{/if}
			</div>
		</div>
	</form>
</div>

<style>
	pre,
	textarea {
		box-sizing: border-box;
		overflow: hidden;
	}

	textarea {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		resize: none;
	}
</style>
