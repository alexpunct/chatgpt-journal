<script lang="ts">
	// Utilities
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import { ProgressRadial, focusTrap, Paginator } from '@skeletonlabs/skeleton';

	// Types
	import type { ShellSettings } from '$libSkeleton/Shell/types';
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import type { Database } from '$lib/supabaseTypes';

	export const getPagination = (page: number, size: number) => {
		const limit = size ? +size : 3;
		const from = page ? page * limit : 0;
		const to = page ? from + size : size;

		return { from, to };
	};

	// Data
	export let data: PageData;

	let { session } = data;
	let loading = false;
	let entries: Database['public']['Tables']['journal']['Row'][] = [];
	let paginationSettings = {
		offset: 0,
		limit: 5,
		size: 0,
		amounts: [1, 2, 5, 10],
		search: ''
	};

	let loadingSearch = false;
	let search = '';

	// Local functions

	onMount(() => {
		loadEntries();
	});

	function onPageChange(e: CustomEvent): void {
		paginationSettings.offset = e.detail;
		loadEntries(paginationSettings.search);
	}

	function onAmountChange(e: CustomEvent): void {
		paginationSettings.limit = e.detail;
		loadEntries(paginationSettings.search);
	}

	const loadEntries = async (search = '', cb: CallableFunction | null = null) => {
		loading = true;

		const { from, to } = getPagination(paginationSettings.offset, paginationSettings.limit);
		const query = supabase
			.from('journal')
			.select('*', { count: 'exact' })
			.eq('user_id', session.user.id)
			.range(from, to)
			.order('day', { ascending: false })
			.limit(paginationSettings.limit);

		if (search) query.like('content', `%${search}%`);

		try {
			const res = await query;

			const { count, data, error, status } = res;

			if (error && status !== 406) throw error;

			entries = data ?? [];
			paginationSettings.size = count ?? 0;
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}
		} finally {
			loading = false;
			if (cb) cb();
		}
	};

	const handleSearch = () => {
		loadingSearch = true;
		loadEntries(search, () => {
			loadingSearch = false;
			paginationSettings.search = search;
		});
	};

	// Component configuration

	const t: ToastSettings = {
		message: '',
		preset: 'error',
		autohide: true,
		timeout: 5000
	};

	const settings: ShellSettings = {
		name: 'Archive',
		description: ``,
		toc: false
	};
</script>

<Shell {settings}>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="mb-4 max-w-md mx-auto">
				<span class="flex-auto">
					<form use:focusTrap={true}>
						<dt class="hidden">Search</dt>
						<dd class="text-sm">
							<div class="">
								<label class="label">
									<form on:submit|preventDefault={handleSearch}>
										<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
											<div class="input-group-shim"><i class="fa-solid fa-search" /></div>
											<input
												use:focusTrap={true}
												type="search"
												placeholder="Search..."
												bind:value={search}
												on:abort={() => {
													search = '';
													handleSearch();
												}}
											/>
											{#if loadingSearch}
												<div class="input-group-shim">
													<ProgressRadial
														stroke={100}
														meter="stroke-success-500"
														track="stroke-success-500/30"
														class="w-4 h-4"
													/>
												</div>
											{:else}
												<button class="variant-soft-success">Go</button>
											{/if}
										</div>
									</form>
								</label>
							</div>
						</dd>
					</form>
				</span>
			</div>
			<div class="grid grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div class="col-span-3 card variant-glass-surface p-4 shadow">
					{#if entries.length === 0}
						<div class="flex justify-center items-center flex-col p-20">
							{#if loading}
								<div class="w-8">
									<ProgressRadial
										stroke={350}
										meter="stroke-success-500"
										track="stroke-success-500/30"
									/>
								</div>
								<div class="mt-2">Loading, please wait...</div>
							{:else}
								<div class="text-2xl text-primary-700">
									<i class="fa-solid fa-face-sad-tear mr-1" />
									No data yet, please add some entries.
								</div>
							{/if}
						</div>
					{/if}
					{#each entries as entry}
						{#if entry.day && entry.content}
							<div class="entry pt-4 ">
								<!-- Header -->
								<header>
									<div class="text-primary-700 pl-4 pr-4 ">
										<i class="fa-solid fa-calendar-alt text-lg mr-2" />
										{new Date(entry.day).toLocaleDateString('en', {
											weekday: 'long',
											year: 'numeric',
											month: 'long',
											day: 'numeric'
										})}
									</div>
								</header>
								<!-- Body -->
								<div class="p-0 md:p-4 space-y-4 mt-4 mb-4 rounded-xl">
									{entry.content}
								</div>
							</div>
						{/if}
					{/each}
					{#if entries.length > 0}
						<div
							class="max-w-xl mx-auto mt-4 pt-4 border-surface-500 border-solid border-x-slate-300"
						>
							<Paginator
								on:page={onPageChange}
								on:amount={onAmountChange}
								bind:settings={paginationSettings}
							/>
						</div>
					{/if}
				</div>
				<!-- <div class="col-span-1 p-4 card variant-glass-surface shadow text-center">
					<h4 class="mb-4">
						<i class="fa-solid fa-filter text-lg mr-2" />
						Narrow down
					</h4>
					<hr />
					<dl class="list pl-4">
						<div class="pt-4 mt-4">
							<span class="flex-auto">
								<dt class="hidden">Search</dt>
								<dd class="text-sm">
									<div class="">
										<label class="label">
											<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
												<div class="input-group-shim"><i class="fa-solid fa-search" /></div>
												<input type="search" placeholder="Search..." />
												<button class="variant-soft-success">Go</button>
											</div>
										</label>
									</div>
								</dd>
							</span>
						</div>
					</dl>
				</div> -->
			</div>
			<!-- See Also -->
			<!-- <div class="card p-4 variant-glass-surface text-center w-full mt-4">
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
					<button on:click={handleSave} class="btn variant-filled-primary card-hover shadow"
						>Save new entry &rarr;</button
					>
				{/if}
			</div> -->
		</div>
	</svelte:fragment>
</Shell>
