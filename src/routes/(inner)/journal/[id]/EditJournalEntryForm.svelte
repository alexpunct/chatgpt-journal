<script lang="ts">
	// Utilities
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { successToast, errorToast } from '$lib/helpers/triggerToast';
	import { dateToHtml5Format } from '$lib/helpers/datetime';

	// Components
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	// Types
	import type { Database } from '$lib/types/supabaseTypes';

	// Props
	export let journalEntry: Database['public']['Tables']['journal']['Row'] | null;

	onMount(() => {
		document.getElementById('edit-form')?.focus();
	});

	// Fetch journal entry for a specific date
	const handleChangeDate = async (e: Event) => {
		const date = (e.target as HTMLInputElement)?.value;

		if (date) {
			const response = await fetch('/api/journal?limit=1&day=' + date);
			if (response.status === 200) {
				const entry = await response.json();
				journalEntry = entry.data[0];
			} else {
				journalEntry = null;
			}
		}
	};

	const handleUpdateContent = (e: Event) => {
		content = (e.target as HTMLTextAreaElement)?.value;
	};

	// Local
	let loading = false;
	let content = journalEntry?.content || '';
	let textareaMinRows = 5;
	let textareaMaxRows = 50; // @TODO remove this and save automatically after typing with debounce
	$: minHeight = `${1 + textareaMinRows * 1.2}em`;
	$: maxHeight = textareaMaxRows ? `${1 + textareaMaxRows * 1.2}em` : `auto`;
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
		<header class="text-center mb-12">
			<h2 class="gradient-heading leading-10">
				{#if $page.url.pathname.endsWith('new') && !journalEntry?.id}
					New Entry for
					<input
						class="ml-1 input max-w-[150px] text-primary-600-300-token"
						type="date"
						name="day"
						required
						placeholder="Choose date"
						max={dateToHtml5Format(new Date())}
						on:change={handleChangeDate}
					/>
				{:else}
					{(journalEntry?.day ? new Date(journalEntry.day) : new Date()).toLocaleDateString(
						'en-US',
						{
							weekday: 'long',
							year: 'numeric',
							month: 'short',
							day: 'numeric'
						}
					)}
				{/if}
			</h2>
		</header>
		<div class="p-0">
			<div class="relative">
				<pre
					class="invisible !text-[11px]"
					aria-hidden="true"
					style="min-height: {minHeight}; max-height: {maxHeight}">{content + '\n\n'}</pre>
				<textarea
					id="edit-form"
					value={journalEntry?.content || ''}
					name="content"
					placeholder="How are you feeling?"
					class="textarea"
					required
					rows="5"
					on:keyup={handleUpdateContent}
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
</style>
