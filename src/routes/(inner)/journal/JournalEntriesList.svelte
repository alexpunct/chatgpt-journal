<script lang="ts">
	// Components
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import JournalEntry from './JournalEntry.svelte';

	// Types
	import type { PageData } from './$types';

	// State variables
	export let data: PageData;

	let loading = false;
</script>

{#if data.journalEntries.length === 0}
	<div class="flex justify-center items-center flex-col p-20">
		{#if loading}
			<div class="w-8">
				<ProgressRadial stroke={350} meter="stroke-secondary-500" track="stroke-secondary-500/30" />
			</div>
			<div class="mt-2">Loading, please wait...</div>
		{:else}
			<div class="text-lg">
				<i class="fa-solid fa-face-sad-tear mr-1" />
				No journal entries...
			</div>
		{/if}
	</div>
{/if}
{#each data.journalEntries as entry}
	{#if entry.day && entry.content}
		<div class="pb-8">
			<JournalEntry journalEntry={entry} />
		</div>
	{/if}
{/each}
