<script lang="ts">
	// Utilities
	import { enhance } from '$app/forms';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import { ProgressRadial, focusTrap, toastStore } from '@skeletonlabs/skeleton';
	import Suggestions from './Suggestions.svelte';

	// Types
	import type { ShellSettings } from '$libSkeleton/Shell/types';
	import type { PageData, ActionData } from './$types';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	// Props
	export let data: PageData;
	export let form: ActionData;

	// Local
	const settings: ShellSettings = {
		name: 'Today',
		description: '',
		toc: false
	};

	let loading = false;

	const t: ToastSettings = {
		message: '',
		preset: 'error',
		autohide: true,
		timeout: 5000
	};

	if (form?.error) {
		toastStore.trigger({ ...t, message: `Could not save: ${form?.error}` });
	}
	if (form?.success) {
		toastStore.trigger({ ...t, preset: 'success', message: `Saved!}` });
	}
</script>

<Shell {settings}>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div
					class="col-span-1 md:col-span-2 md:card md:variant-glass-surface md:p-4 shadow overflow-hidden"
				>
					<form
						method="POST"
						use:enhance={() => {
							toastStore.clear();
							loading = true;
							return async () => {
								loading = false;
							};
						}}
					>
						<!-- Header -->
						<header class="text-center p-4">
							<h4 class="text-tertiary-700">
								<i class="fa-solid fa-calendar-alt text-lg mr-2" />
								{new Date().toLocaleDateString('en-US', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								})}
							</h4>
						</header>
						<!-- Body -->
						<div class="p-0 md:p-3 space-y-4">
							{#if data.journalEntry?.id}
								<input type="hidden" name="id" value={data.journalEntry?.id} />
							{/if}
							<textarea
								name="content"
								use:focusTrap={true}
								class="textarea text-justify leading-6 tracking-wide max-h-60 md:max-h-max pb-4"
								required
								rows="19">{data.journalEntry?.content}</textarea
							>
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
									<button
										class="btn variant-filled-primary card-hover shadow md:opacity-60 hover:opacity-100 pointer-events-auto"
										>Save</button
									>
								{/if}
							</div>
						</div>
					</form>
				</div>
				<div class="hidden md:block col-span-1 p-4 card variant-glass-surface shadow">
					<Suggestions />
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
