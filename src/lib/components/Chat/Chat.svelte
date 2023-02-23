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
			username: 'CJ',
			text: 'Hello friend, what do you want to talk about?',
			time: new Date(),
			ownerChatbot: true
		}
	];

	const t: ToastSettings = {
		message: '',
		preset: 'warning',
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
		const conversationHistory = messages.map((msg) => `${msg.username}: ${msg.text}`).join('\n');
		const recentConversationHistory = conversationHistory.split('\n').slice(-6).join('\n');
		answer = '';
		loading = true;
		messages.push(event.detail);
		messages = [...messages];

		// @TODO if the conversation history is too long, trim it down or create summary

		try {
			const eventSource = await createEventSource(
				event.detail.text,
				$userProfile?.full_name || event.detail.username,
				messages.length > 10 ? recentConversationHistory : conversationHistory,
				$userProfile?.profiles_private?.openai_api_key
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
						username: 'CJ',
						text: answer,
						time: new Date(),
						ownerChatbot: true
					});
					answer = '';
					messages = [...messages];
					return;
				}

				isResponding = true;

				const completionResponse: { choices: [{ text: string }] } = JSON.parse(e.data);
				const [{ text }] = completionResponse.choices;

				if (text?.trim() === '') return;

				answer = (answer ?? '') + text;
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
	<div class="history md:p-2 overflow-y-scroll h-[350px] md:h-[450px]" bind:this={div}>
		<ul>
			{#each messages as message, i (message.time)}
				{#if message.text}
					<li class="clearfix">
						<ChatMessage {message} />
					</li>
				{/if}
			{/each}
			{#if answer}
				<li class="clearfix">
					<ChatMessage
						message={{
							username: 'CJ',
							text: answer,
							time: new Date(),
							ownerChatbot: true
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
