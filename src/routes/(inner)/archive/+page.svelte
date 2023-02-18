<script lang="ts">
	// Utilities
	import { onMount } from 'svelte';
	import { supabase, getPagination } from '$lib/supabaseClient';
	import { dateToHtml5Format } from '$lib/helpers/datetime';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import {
		ProgressRadial,
		focusTrap,
		Paginator,
		menu,
		Accordion,
		AccordionItem,
		modalStore,
		toastStore
	} from '@skeletonlabs/skeleton';
	import JournalEntryEditor from '$lib/components/Modals/JournalEntryEditor.svelte';

	// Types
	import type { ToastSettings, ModalSettings } from '@skeletonlabs/skeleton';
	import type { ShellSettings } from '$libSkeleton/Shell/types';
	import type { Database } from '$lib/supabaseTypes';
	import type { PageData } from './$types';

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
	let addEntryDay = dateToHtml5Format(new Date());

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

		if (search) query.ilike('content', `%${search}%`);

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

	// Event handlers

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

	const handleEditEntry = async (content: string, id: number | null = null) => {
		loading = true;
		try {
			let { error } = await supabase.from('journal').upsert({
				// add the id if it exists, otherwise add the day if it's a new entry
				...(id ? { id } : { day: new Date(addEntryDay).toISOString().split('T')[0] }),
				user_id: data.session.user.id,
				content
			});
			if (error) throw error;

			loadEntries(paginationSettings.search, () => {
				loading = false;
				toastStore.trigger({
					...t,
					message: 'Entry saved successfully.',
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

	async function triggerEdit(entryId?: number): Promise<void> {
		// if it an existing entry from the list, we can just pass it
		let currentEntry = entryId ? entries.find((e) => e.id === entryId) : null;

		// if it's a new entry, we need to check if there is already an entry for that day
		if (!entryId) {
			const { data: entry, error } = await supabase
				.from('journal')
				.select('*')
				.eq('user_id', data.session.user.id)
				.eq('day', new Date(addEntryDay).toISOString().split('T')[0]);

			if (!error && entry && entry.length) {
				entryId = entry[0].id;
				currentEntry = entry[0];
			}
		}

		const d: ModalSettings = {
			type: 'component',
			component: {
				// Pass a reference to your custom component
				ref: JournalEntryEditor,
				// Add your props as key/value pairs
				props: {
					entry: currentEntry,
					addEntryDay: !entryId && addEntryDay,
					handleEditEntry
				},
				slot: '<p>Entry Editor</p>'
			},
			// make background lighter
			modalClasses: 'bg-surface-200',
			buttonTextConfirm: 'Save entry'
		};
		modalStore.trigger(d);
	}

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
				<!-- Left Column -->
				<div
					class="col-span-3 lg:col-span-1 py-4 md:px-4 card variant-glass-surface shadow text-center"
				>
					<!-- Filters -->
					<div class="container">
						<h4 class="mb-4">
							<i class="fa-solid fa-filter text-lg mr-2" />
							Narrow down
						</h4>
						<hr />
						<dl class="list px-4">
							<div class="md:pt-4 mt-4">
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
					<!-- Add past entries -->
					<div class="container mt-10 md:mt-14 pt-4 space-y-4">
						<h4 class="mb-4">
							<i class="fa-solid fa-list-check text-lg mr-2" />
							Add past entries
						</h4>
						<hr />
						<Accordion autocollapse>
							<AccordionItem open>
								<svelte:fragment slot="lead"
									><i class="fa-solid fa-plus text-lg mr-2" /></svelte:fragment
								>
								<svelte:fragment slot="summary">Create/Edit single entry</svelte:fragment>
								<svelte:fragment slot="content">
									<label class="label py-4 mb-1 md:px-12">
										<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
											<div class="input-group-shim" />
											<input
												class="input"
												type="date"
												placeholder="Choose date"
												bind:value={addEntryDay}
												max={dateToHtml5Format(new Date())}
											/>
											<button
												class="variant-soft-secondary"
												on:click={(e) => {
													triggerEdit();
												}}>Edit</button
											>
										</div>
									</label>
								</svelte:fragment>
							</AccordionItem>
							<AccordionItem>
								<svelte:fragment slot="lead"
									><i class="fa-solid fa-file-import text-lg mr-2" /></svelte:fragment
								>
								<svelte:fragment slot="summary">Import from file</svelte:fragment>
								<svelte:fragment slot="content"
									>Import from an existing archive file (coming soon)</svelte:fragment
								>
							</AccordionItem>
						</Accordion>
					</div>
				</div>
				<!-- Main Column -->
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
									<div class="text-tertiary-700 md:px-4 text-center md:text-left ">
										<i class="fa-solid fa-calendar-alt text-lg mr-2" />
										<span>
											{new Date(entry.day).toLocaleDateString('en', {
												weekday: 'long',
												year: 'numeric',
												month: 'short',
												day: 'numeric'
											})}
											{#if new Date(entry.day).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)}
												<span class="ml-1 badge variant-soft-secondary">Today</span>
											{/if}
											<span class="actions relative float-right pt-1">
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
															<button
																class="option w-full hover:text-primary-400-500-token"
																on:click={(e) => {
																	triggerEdit(entry.id);
																}}><i class="fa-solid fa-pen-to-square mr-2" /> Edit</button
															>
														</li>
														<li>
															<button
																class="option w-full mt-2 md:mt-1 hover:text-error-400-500-token"
																on:click={(e) => {
																	triggerDeleteConfirm(entry.id);
																}}><i class="fa-solid fa-trash-can mr-2" /> Delete</button
															>
														</li>
													</ul>
												</div>
											</span>
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
