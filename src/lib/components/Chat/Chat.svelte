<script lang="ts">
	// Utilities
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { createEventSource } from '$lib/supabaseClient';
	import { createEventDispatcher } from 'svelte';

	// Components
	import { errorToast } from '$lib/helpers/triggerToast';
	import ChatMessage from './ChatMessage.svelte';
	import ChatInput from '$lib/components/Chat/ChatInput.svelte';

	// Types
	import type { Message } from '$lib/types/chatTypes';

	// Data
	export let conversation: Message[];
	const dispatch = createEventDispatcher();

	// Real time
	let answer = '';

	let div: HTMLDivElement;

	// Lifecycle
	afterUpdate(() => {
		if (div) {
			div.scrollTo(0, div.scrollHeight);
		}
	});

	const handleSendMessage = async (event: { detail: Message }) => {
		const conversationHistory = conversation;
		// take the last 6 conversation
		const recentConversationHistory = conversationHistory.slice(-10);
		answer = '';
		dispatch('addMessage', event.detail);

		// @TODO if the conversation history is too long, trim it down or create summary

		try {
			const eventSource = await createEventSource(
				event.detail.content,
				'user',
				conversation.length > 10 ? recentConversationHistory : conversationHistory
			);

			eventSource.addEventListener('error', (e) => {
				errorToast('OpenAI Error. Please try again later...');
			});

			eventSource.addEventListener('message', (e) => {
				if (e.data === '[DONE]') {
					dispatch('addMessage', {
						role: 'assistant',
						content: answer,
						time: new Date()
					});
					answer = '';
					return;
				}

				const completionResponse: { choices: [{ delta: { content: string } }] } = JSON.parse(
					e.data
				);
				const [
					{
						delta: { content }
					}
				] = completionResponse.choices;

				if (!content || content.trim() === '') return;

				answer = (answer ?? '') + content;
			});

			eventSource.stream();
		} catch (error) {
			errorToast('OpenAI Error. Please try again later...');
			return;
		}
	};
</script>

<div class="root">
	<div class="history md:p-2 overflow-y-scroll h-[350px] md:h-[450px] pr-2" bind:this={div}>
		<ul>
			{#each conversation as message, i (message.time)}
				{#if message.content}
					<li class="clearfix">
						<ChatMessage {message} />
					</li>
				{/if}
			{/each}
			{#if answer}
				<li class="clearfix">
					<ChatMessage
						message={{
							role: 'assistant',
							content: answer,
							time: new Date()
						}}
					/>
				</li>
			{/if}
		</ul>
	</div>
	<ChatInput on:message={handleSendMessage} />
</div>

<style>
	.root .history ul {
		list-style-type: none;
	}
	.clearfix:after {
		visibility: hidden;
		display: block;
		font-size: 0;
		content: ' ';
		clear: both;
		height: 0;
	}
</style>
