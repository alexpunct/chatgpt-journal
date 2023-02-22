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
	<form class="py-4 pr-5" on:submit|preventDefault={handleSubmit}>
		<div class="input-group input-group-divider grid-cols-[1fr_auto] snap-center mx-auto">
			<textarea
				on:keydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						handleSubmit();
					}
				}}
				rows="1"
				class="input p-3 px-4 rounded-r-none resize-none"
				bind:value
				placeholder="Type your message"
			/>
			<button type="submit" class="variant-filled-primary w-24"
				><i class="fa-solid fa-paper-plane" /> Send</button
			>
		</div>
		<!-- <small class="pl-4 text-surface-600-300-token"
				>Remaining: {remainingCharacters} characters.</small
			> -->
	</form>
</div>
