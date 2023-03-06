<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	let value = '';

	const handleSubmit = () => {
		dispatch('message', { content: value, time: new Date(), role: 'user' });

		value = '';
	};
	onMount(() => {
		document.getElementById('message-input')?.focus();
	});
</script>

<div
	class="fixed md:absolute bottom-0 p-2 py-6 md:py-4 w-full md:left-0 bg-surface-900 md:variant-glass-surface ml-[-7px]"
>
	<form on:submit|preventDefault={handleSubmit}>
		<div
			class="input-group input-group-divider grid-cols-[1fr_auto] snap-center md:w-[70%] xl:w-[50%] mx-auto !border-transparent"
		>
			<textarea
				id="message-input"
				on:keydown={(e) => {
					if (e.key === 'Enter' && !e.shiftKey) {
						e.preventDefault();
						handleSubmit();
					}
				}}
				rows="1"
				class="input p-3 px-4 rounded-r-none resize-none !border-transparent"
				bind:value
				placeholder="Type your message"
			/>
			<button type="submit" class="btn-gradient-success w-24"
				><i class="fa-solid fa-paper-plane" /> Send</button
			>
		</div>
		<!-- <small class="pl-4 text-surface-600-300-token"
				>Remaining: {remainingCharacters} characters.</small
			> -->
	</form>
</div>
