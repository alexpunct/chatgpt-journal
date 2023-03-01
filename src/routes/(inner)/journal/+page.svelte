<script lang="ts">
	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import JournalEntriesList from './JournalEntriesList.svelte';
	import Sidebar from './Sidebar.svelte';
	import Pagination from './Pagination.svelte';

	// Types
	import type { PageData } from './$types';

	// State variables
	export let data: PageData;
</script>

<Shell
	settings={{
		name: 'Archive',
		description: ``,
		toc: false
	}}
>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div class="col-span-1 md:col-span-2 card p-4 pt-8 mx-auto shadow overflow-hidden">
					<JournalEntriesList {data} />
					<Pagination {data} />
				</div>
				<div class="hidden md:block col-span-1 p-4 card variant-glass-surface shadow">
					<Sidebar />
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
