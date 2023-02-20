<script lang="ts">
	import { ProgressRadial, ProgressBar } from '@skeletonlabs/skeleton';

	import type { Message } from '$lib/types/chatTypes';

	export let message: Message;
	$: alignRight = !message?.ownerChatbot;
</script>

<div class="root {alignRight && `align-right`}">
	{#if !alignRight}
		<span>{message.username}</span>
		<i class="fa fa-circle online" /> |
	{/if}
	<span class="time">
		<small
			>{`${new Date().toLocaleDateString('en', {
				weekday: 'short',
				month: 'short',
				day: 'numeric'
			})}`}</small
		>
		<i class="fa-solid fa-clock text-xs" />
		{`${new Date(message.time).toLocaleTimeString()}`}
	</span>
	{#if alignRight}
		|
		<span>{message.username}</span>
		<i class="fa fa-circle me" />
	{/if}
</div>
<div class="message {alignRight ? `other-message` : `my-message`} {alignRight && `float-right`}">
	{message.text || '...'}
</div>

<style>
	.root {
		margin-bottom: 15px;
	}
	.time {
		color: #a8aab1;
		padding-left: 6px;
	}
	.message {
		color: #000000;
		font-weight: bold;
		padding: 18px 20px;
		line-height: 26px;
		font-size: 16px;
		border-radius: 7px;
		margin-bottom: 30px;
		width: 90%;
		position: relative;
	}
	.message:after {
		bottom: 100%;
		left: 7%;
		border: solid transparent;
		content: ' ';
		height: 0;
		width: 0;
		position: absolute;
		pointer-events: none;
		border-bottom-color: #86bb71;
		border-width: 10px;
		margin-left: -10px;
	}
	.message.other-message {
		width: 50%;
	}
	.my-message {
		background: #86bb71;
	}
	.other-message {
		background: #94c2ed;
	}
	.other-message:after {
		border-bottom-color: #94c2ed;
		left: 93%;
	}
	.online,
	.me {
		margin-right: 3px;
		font-size: 10px;
	}
	.online {
		color: #86bb71;
	}
	.me {
		color: #94c2ed;
	}
	.align-right {
		text-align: right;
	}
	.float-right {
		float: right;
	}
</style>
