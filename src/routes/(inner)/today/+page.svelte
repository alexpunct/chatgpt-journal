<script lang="ts">
	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import Suggestions from './Suggestions.svelte';
	import EditJournalEntryForm from './EditJournalEntryForm.svelte';

	// Types
	import type { PageData } from './$types';

	// Props
	export let data: PageData;
</script>

<Shell
	settings={{
		name: 'Today',
		description: '',
		toc: false
	}}
>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div
					class="col-span-1 md:col-span-2 md:card md:variant-glass-surface md:p-4 shadow overflow-hidden"
				>
					<EditJournalEntryForm journalEntry={data.journalEntry} />
				</div>
				<div class="hidden md:block col-span-1 p-4 card variant-glass-surface shadow">
					<Suggestions />
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
