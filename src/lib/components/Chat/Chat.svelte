<script lang="ts">
	// Utilities
	import { beforeUpdate, afterUpdate } from 'svelte';
	import { createEventSource } from '$lib/supabaseClient';
	import { userProfile } from '$lib/stores';

	// Components
	import { toastStore } from '@skeletonlabs/skeleton';
	import ChatMessage from './ChatMessage.svelte';
	import ChatInput from '$lib/components/Chat/ChatInput.svelte';

	// Types
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { Message } from '$lib/types/chatTypes';

	// Data

	// export let conversationId: string;
	let messages: Message[] = [
		{
			role: 'assistant',
			content: 'Hello, what do you want to talk about?',
			time: new Date()
		}
	];

	const t: ToastSettings = {
		message: '',
		autohide: true,
		timeout: 3000
	};

	// Real time
	let answer = '';
	let loading = false;
	let isResponding = false;

	let div: HTMLDivElement;
	let autoscroll: boolean = false;

	// Lifecycle

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	const handleSendMessage = async (event: { detail: Message }) => {
		const conversationHistory = messages;
		// take the last 6 messages
		const recentConversationHistory = conversationHistory.slice(-6);
		answer = '';
		loading = true;
		messages.push(event.detail);
		messages = [...messages];

		// @TODO if the conversation history is too long, trim it down or create summary

		try {
			const eventSource = await createEventSource(
				event.detail.content,
				'user',
				messages.length > 10 ? recentConversationHistory : conversationHistory
			);

			eventSource.addEventListener('error', (e) => {
				console.error(e);
				toastStore.trigger({
					...t,
					message: 'OpenAI Error. Please try again later...'
				});
			});

			eventSource.addEventListener('message', (e) => {
				loading = false;

				if (e.data === '[DONE]') {
					isResponding = false;
					messages.push({
						role: 'assistant',
						content: answer,
						time: new Date()
					});
					answer = '';
					messages = [...messages];
					return;
				}

				isResponding = true;

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

			loading = true;
		} catch (error) {
			toastStore.trigger({
				...t,
				message: 'OpenAI Error'
			});
			return;
		}
	};
</script>

<div class="root">
	<div class="history md:p-2 overflow-y-scroll h-[350px] md:h-[450px] pr-2" bind:this={div}>
		<ul>
			{#each messages as message, i (message.time)}
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
