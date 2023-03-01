<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';

	// Helpers
	import { supabasePaginationDefaults } from '$lib/helpers/pagination';

	// Components
	import { Paginator } from '@skeletonlabs/skeleton';

	// Types
	import type { PageData } from './$types';

	export let data: PageData;

	let paginationSettings = {
		...supabasePaginationDefaults,
		...($page.url.searchParams.has('offset')
			? { offset: parseInt($page.url.searchParams.get('offset') as string) }
			: {}),
		...($page.url.searchParams.has('limit')
			? { limit: parseInt($page.url.searchParams.get('limit') as string) }
			: {}),
		size: data.count
	};

	$: {
		paginationSettings = {
			...paginationSettings,
			size: data.count
		};
	}

	const updateUrl = async () => {
		const url = new URL(window.location.href);
		url.searchParams.set('offset', paginationSettings.offset.toString());
		url.searchParams.set('limit', paginationSettings.limit.toString());
		await goto(url.toString());
		invalidate('journal:list');
	};

	async function onPageChange(e: CustomEvent): Promise<void> {
		paginationSettings.offset = e.detail;
		updateUrl();
	}

	async function onAmountChange(e: CustomEvent): Promise<void> {
		paginationSettings.limit = e.detail;
		updateUrl();
	}
</script>

{#if data.journalEntries.length > 0}
	<div class="max-w-xl mx-auto mt-4 pt-4 border-surface-500 border-solid border-x-slate-300">
		<Paginator
			bind:settings={paginationSettings}
			on:page={onPageChange}
			on:amount={onAmountChange}
		/>
	</div>
{/if}
