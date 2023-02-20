<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let value = '';

	const handleSubmit = () => {
		dispatch('message', { text: value, time: new Date(), username: 'me' });

		value = '';
	};
	$: remainingCharacters = 500 - value.length;
</script>

<div class="container">
	<form class="space-y-4" on:submit|preventDefault={handleSubmit}>
		<label class="label">
			<div class="input-group input-group-divider grid-cols-[1fr_auto]">
				<input class="input p-3 px-4 rounded-r-none" bind:value placeholder="Type your message" />
				<button type="submit" class="variant-filled-primary">send</button>
			</div>
			<!-- <small class="pl-4 text-surface-600-300-token"
				>Remaining: {remainingCharacters} characters.</small
			> -->
		</label>
	</form>
</div>
