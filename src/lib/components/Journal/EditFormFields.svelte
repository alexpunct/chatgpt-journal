<script lang="ts">
	// Components
	import { ProgressRadial, focusTrap } from '@skeletonlabs/skeleton';

	// Types
	import type { Database } from '$lib/types/supabaseTypes';
	// Props
	export let journalEntry: Database['public']['Tables']['journal']['Row'];
	export let loading: boolean = false;
</script>

<div class="p-0 md:p-3 space-y-4">
	{#if journalEntry?.id}
		<input type="hidden" name="id" value={journalEntry?.id} />
	{/if}
	<textarea
		name="content"
		use:focusTrap={true}
		class="textarea text-justify leading-5 tracking-wide max-h-60 md:max-h-max pb-4"
		required
		rows="19">{journalEntry?.content || null}</textarea
	>
	<div class="text-center w-full pointer-events-none">
		{#if loading}
			<div class="flex justify-center p-1 pb-1.5">
				<div class="w-8">
					<ProgressRadial stroke={150} meter="stroke-primary-500" track="stroke-primary-500/30" />
				</div>
			</div>
		{:else}
			<button class="btn min-w-[150px] pointer-events-auto btn-gradient-primary">Save</button>
		{/if}
	</div>
</div>
