<script lang="ts">
	// Utilities
	import { onMount, beforeUpdate, afterUpdate } from 'svelte';
	import { createEventSource } from '$lib/supabaseClient';
	import { userProfile } from '$lib/stores';

	// Components
	import ChatHeader from '$lib/components/Chat/ChatHeader.svelte';
	import ChatMessage from './ChatMessage.svelte';
	import ChatInput from '$lib/components/Chat/ChatInput.svelte';

	// Types
	import type { ToastSettings } from '@skeletonlabs/skeleton';
	import type { CreateCompletionResponse } from 'openai';
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

	$: dynamicMessages = messages.map((message) => {
		return {
			...message,
			text: message.text.replace(/<[^>]*>?/gm, '')
		};
	});

	// Real time
	let answer = '';
	let loading = false;
	let isResponding = false;
	$: status = loading
		? 'looking through your journal...'
		: isResponding
		? 'responding...'
		: 'waiting for your message...';

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

		const eventSource = await createEventSource(
			event.detail.text,
			$userProfile?.full_name || event.detail.username,
			messages.length > 10 ? recentConversationHistory : conversationHistory,
			$userProfile?.profiles_private?.openai_api_key
		);

		eventSource.addEventListener('error', (e) => {
			console.error(e);
		});

		// @TODO if there's an error, show a toast
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

			const completionResponse: CreateCompletionResponse = JSON.parse(e.data);
			const [{ text }] = completionResponse.choices;

			if (text?.trim() === '') return;

			answer = (answer ?? '') + text;
		});

		eventSource.stream();

		loading = true;
	};
</script>

<div class="root">
	<!-- <ChatHeader title={`Chat on ${conversationId}`} /> -->
	<!-- <hr /> -->
	<!-- <div>{$userProfile?.full_name}: <br /> {status}</div> -->
	<!-- <div class="p-4 text-surface-600-300-token">
		<div class="mb-2">Bot <span class="badge bg-surface-600">{status}</span></div>
		{#if loading}
			<div class="p-2 bg-surface-400-500-token">Loading...</div>
		{/if}
		{#if answer}
			<div class="p-2 bg-surface-400-500-token">{answer}</div>
		{/if}
	</div> -->
	<div class="history" bind:this={div}>
		<ul>
			{#each messages as message, i (message.time)}
				{#if message.text}
					<li class="clearfix">
						<ChatMessage {message} />
					</li>
				{/if}
			{/each}
			<!-- {#if loading}
				<li class="clearfix">
					<ChatMessage loading />
				</li>
			{/if} -->
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
{#if !$userProfile?.profiles_private?.openai_api_key}
	<aside class="alert variant-soft-warning mt-8">
		<!-- Icon -->
		<div><i class="fa fa-warning text-3xl" /></div>
		<!-- Message -->
		<div class="alert-message">
			<h3>Chatbot Model</h3>
			<p>
				Currently you are using the 'text-curie-001' OpenAi model.
				<br />To use the most powerful 'text-davinci-003', please set your own OpenAi key in the
				Settings.
			</p>
		</div>
	</aside>
{/if}

<style>
	.root .history {
		padding: 30px 30px 20px;
		overflow-y: scroll;
		height: 400px;
	}
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
