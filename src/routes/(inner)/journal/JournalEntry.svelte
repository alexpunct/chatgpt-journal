<script lang="ts">
	// Utilities
	import { page } from '$app/stores';
	import { invalidate } from '$app/navigation';

	// Components
	import { popup } from '@skeletonlabs/skeleton';
	import { successToast, errorToast } from '$lib/helpers/triggerToast';

	// types
	import type { Database } from '$lib/types/supabaseTypes';
	export let journalEntry: Database['public']['Tables']['journal']['Row'];

	// local variables

	let day: Date;
	let regex: RegExp;

	$: {
		day = journalEntry.day ? new Date(journalEntry.day) : new Date();
		const query = $page.url.searchParams.get('q') as string;
		regex = new RegExp(query, 'gi');
	}

	// event handlers
	const handleDelete = async (e: Event) => {
		if (!confirm('Are you sure you want to delete this entry?')) {
			return;
		}
		const id = (e.target as HTMLButtonElement)?.dataset.id;
		if (id) {
			const response = await fetch(`/api/journal/${id}`, {
				method: 'DELETE'
			});
			if (response.status === 200) {
				successToast(`Entry deleted.`);
				invalidate('journal:list');
			} else {
				errorToast(`Something went wrong.`);
			}
		}
	};
</script>

<!-- Header -->
<header
	class="cursor-pointer"
	use:popup={{
		target: `menu_entry_${journalEntry.id}`,
		event: 'click',
		placement: 'bottom-end'
	}}
>
	<div class="text-tertiary-700 md:px-4 text-center">
		<!-- <i class="fa-solid fa-calendar-alt text-lg mr-2" /> -->
		<span class="text-lg">
			{new Date(day).toLocaleDateString('en', {
				weekday: 'long',
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			})}
			{#if new Date(day).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0)}
				<span class="ml-1 badge variant-soft-secondary">Today</span>
			{/if}
			<span class="actions relative float-right pt-1">
				<button
					class="px-4 text-tertiary-700 hover:text-tertiary-400-500-token focus:text-tertiary-400-500-token"
					><i class="fa-solid fa-ellipsis-vertical" /></button
				>
				<div
					class="card w-24 shadow-xl menu-tr hidden text-sm bg-surface-300-600-token text-surface-900-50-token"
					data-popup={`menu_entry_${journalEntry.id}`}
				>
					<ul>
						<li>
							<a
								href={`/journal/${journalEntry.id}`}
								class="btn option w-full hover:text-primary-400-500-token"
								><i class="fa-solid fa-pen-to-square mr-2" /> Edit</a
							>
						</li>
						<li>
							<button
								class="option w-full py-1 pb-3 md:mt-1 hover:text-error-400-500-token"
								data-id={journalEntry.id}
								on:click={handleDelete}><i class="fa-solid fa-trash-can mr-2" /> Delete</button
							>
						</li>
					</ul>
				</div>
			</span>
		</span>
	</div>
</header>
<!-- Body -->
{#if journalEntry.content}
	<div class="p-0 md:p-4 space-y-4 mt-4 mb-4">
		<p class="rounded-xl leading-6 tracking-wide">
			{@html journalEntry.content.replace(
				regex,
				`<span class="bg-secondary-50-900-token">$&</span>`
			)}
		</p>
	</div>
{/if}
