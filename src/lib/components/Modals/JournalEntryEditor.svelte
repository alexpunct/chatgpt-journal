<script lang="ts">
	import type { Database } from '$lib/supabaseTypes';
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;
	export let handleEditEntry: CallableFunction;
	export let entry: Database['public']['Tables']['journal']['Row'] | null;
	export let addEntryDay: Date | null;

	let day = entry?.day ? new Date(entry.day) : addEntryDay ? new Date(addEntryDay) : new Date();
	const isToday = day.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// Form Data
	const formData = {
		content: entry?.content || ''
	};
	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		handleEditEntry(formData.content, entry?.id);
		modalStore.close();
	}
</script>

<div class="space-y-4">
	<form
		class="modal-form space-y-4 rounded-container-token"
		on:submit|preventDefault={onFormSubmit}
	>
		<div class="inner">
			<label class="label">
				<header>
					<h4 class="text-center pb-4 text-tertiary-700">
						{isToday
							? 'Today'
							: day.toLocaleDateString('en', {
									weekday: 'long',
									year: 'numeric',
									month: 'short',
									day: 'numeric'
							  })}
					</h4>
				</header>
				<textarea
					class="textarea text-justify leading-6 tracking-wide max-h-60 md:max-h-max pb-4"
					required
					rows="19"
					bind:value={formData.content}
				/>
			</label>
		</div>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        	<button class="btn {parent.buttonNeutral}" on:click|preventDefault={parent.onClose}>{parent.buttonTextCancel}</button>
        	<button class="btn {parent.buttonPositive}">{parent.buttonTextConfirm}</button>
    	</footer>
	</form>
</div>
