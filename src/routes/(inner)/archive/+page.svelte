<script lang="ts">
	// Utilities
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import {
		ProgressRadial,
		focusTrap,
		Paginator,
		menu,
		Modal,
		modalStore,
		toastStore
	} from '@skeletonlabs/skeleton';

	// Types
	import type { ToastSettings, ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import type { ShellSettings } from '$libSkeleton/Shell/types';
	import type { Database } from '$lib/supabaseTypes';
	import type { PageData } from './$types';

	export const getPagination = (page: number, size: number) => {
		const limit = size ? +size : 5;
		const from = page ? page * limit : 0;
		const to = page ? from + size : size;

		return { from, to };
	};

	// State variables
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

	function handlePaginationUpdate(e: CustomEvent): void {
		paginationSettings.offset = e.detail;
		loadEntries(paginationSettings.search);
	}

	const handleSearch = () => {
		loadingSearch = true;
		loadEntries(search, () => {
			loadingSearch = false;
			paginationSettings.search = search;
		});
	};

	const handleDeleteEntry = async (id: number) => {
		loading = true;
		try {
			let { error } = await supabase.from('journal').delete().eq('id', id);
			if (error) throw error;

			loadEntries(paginationSettings.search, () => {
				loading = false;
				toastStore.trigger({
					...t,
					message: 'Entry deleted successfully.',
					preset: 'success'
				});
			});
		} catch (error) {
			console.log('error', error);
			toastStore.trigger({ ...t, message: 'An unknown error occurred.' });
			loading = false;
		}
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

	function triggerDeleteConfirm(entryId: number): void {
		const alert: ModalSettings = {
			type: 'confirm',
			title: 'Confirm Delete',
			body: 'Are you sure you want to delete this entry?',
			response: (r: boolean) => {
				if (r) handleDeleteEntry(entryId);
			},
			// Optionally override buttont text
			buttonTextCancel: 'Cancel',
			buttonTextConfirm: 'Yes, delete it'
		};
		modalStore.trigger(alert);
	}
</script>

<Shell {settings}>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="grid grid-cols-3 gap-2">
				<div class="col-span-3 lg:col-span-1 p-4 card variant-glass-surface shadow text-center">
					<h4 class="mb-4">
						<i class="fa-solid fa-filter text-lg mr-2" />
						Narrow down
					</h4>
					<hr />
					<dl class="list pl-4">
						<div class="pt-4 mt-4">
							<form use:focusTrap={true} on:submit|preventDefault={handleSearch}>
								<dt class="hidden">Search</dt>
								<dd class="text-sm">
									<div class="">
										<label class="label">
											<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
												<div class="input-group-shim  ">
													<i class="fa-solid fa-search hidden md:block" />
												</div>
												<input
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
															meter="stroke-secondary-500"
															track="stroke-secondary-500/30"
															class="w-4 h-4"
														/>
													</div>
												{:else}
													<button class="variant-soft-secondary">Go </button>
												{/if}
											</div>
										</label>
									</div>
								</dd>
							</form>
						</div>
					</dl>
				</div>
				<!-- How are you feeling? -->
				<div class="col-span-3 lg:col-span-2 card variant-glass-surface p-4 lg:px-8">
					{#if entries.length === 0}
						<div class="flex justify-center items-center flex-col p-20">
							{#if loading}
								<div class="w-8">
									<ProgressRadial
										stroke={350}
										meter="stroke-secondary-500"
										track="stroke-secondary-500/30"
									/>
								</div>
								<div class="mt-2">Loading, please wait...</div>
							{:else}
								<div class="text-2xl text-primary-700">
									<i class="fa-solid fa-face-sad-tear mr-1" />
									No data...
								</div>
							{/if}
						</div>
					{/if}
					{#each entries as entry}
						{#if entry.day && entry.content}
							<div class="pt-4">
								<!-- Header -->
								<header>
									<div class="text-tertiary-700 lg:pl-4 pr-4 text-center md:text-left ">
										<i class="fa-solid fa-calendar-alt text-lg mr-2" />
										{new Date(entry.day).toLocaleDateString('en', {
											weekday: 'long',
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})}
										<span class="actions relative float-right">
											<!-- Trigger: apply the 'use:menu' action and supply the unique menu ID -->
											<button
												class="px-4 text-tertiary-700 hover:text-tertiary-400-500-token focus:text-tertiary-400-500-token"
												use:menu={{
													menu: `menu_entry_${entry.id}`,
													interactive: true,
													fixed: true
												}}><i class="fa-solid fa-ellipsis-vertical" /></button
											>

											<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
											<div
												class="card p-2 w-24 shadow-xl menu-tr hidden text-sm bg-surface-300-600-token text-surface-900-50-token"
												data-menu={`menu_entry_${entry.id}`}
											>
												<ul>
													<li>
														<button class="option w-full hover:text-primary-400-500-token"
															><i class="fa-solid fa-pen-to-square mr-2" /> Edit</button
														>
													</li>
													<li>
														<button
															class="option w-full mt-1 hover:text-error-400-500-token"
															on:click={(e) => {
																triggerDeleteConfirm(entry.id);
															}}><i class="fa-solid fa-trash-can mr-2" /> Delete</button
														>
													</li>
												</ul>
											</div>
										</span>
									</div>
								</header>
								<!-- Body -->
								<div class="p-0 md:p-4 space-y-4 mt-4 mb-4">
									<p class="rounded-xl text-justify leading-6 tracking-wide whitespace-pre-line">
										{entry.content}
									</p>
								</div>
							</div>
						{/if}
					{/each}
					{#if entries.length > 0}
						<div
							class="max-w-xl mx-auto mt-4 pt-4 border-surface-500 border-solid border-x-slate-300"
						>
							<Paginator
								on:page={handlePaginationUpdate}
								on:amount={handlePaginationUpdate}
								bind:settings={paginationSettings}
							/>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
