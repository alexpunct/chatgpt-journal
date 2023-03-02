<script lang="ts">
	import type { Message } from '$lib/types/chatTypes';

	export let message: Message;
	$: alignRight = message?.role === 'user';
	$: username = message?.role === 'user' ? 'You' : 'ChatGPT';
</script>

<div class="root {alignRight && `align-right`}">
	{#if !alignRight}
		<span>{username}</span>
		<i class="fa fa-circle online" /> |
	{/if}
	<span class="time text-surface-500-400-token">
		<small
			>{`${new Date().toLocaleDateString('en', {
				month: 'short',
				day: 'numeric'
			})}`}
			<i class="fa-solid fa-clock text-xs" />
			{`${new Date(message.time).toLocaleTimeString()}`}</small
		>
	</span>
	{#if alignRight}
		|
		<span>{username}</span>
		<i class="fa fa-circle me" />
	{/if}
</div>
<div
	class="message p-3 md:p-5 tracking-wide {alignRight
		? `other-message`
		: `my-message`} {alignRight && `float-right`}"
>
	{message.content || '...'}
</div>

<style>
	.root {
		margin-bottom: 15px;
	}
	.time {
		padding-left: 6px;
	}
	.message {
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
		border-bottom-color: #2c3627;
		border-width: 10px;
		margin-left: -10px;
	}
	.message.other-message {
		width: 70%;
	}
	.my-message {
		background: #2c3627;
	}
	.other-message {
		background: #232f39;
	}
	.other-message:after {
		border-bottom-color: #232f39;
		left: 93%;
	}
	.online,
	.me {
		margin-right: 3px;
		font-size: 10px;
	}
	.online {
		color: #2c3627;
	}
	.me {
		color: #232f39;
	}
	.align-right {
		text-align: right;
	}
	.float-right {
		float: right;
	}
</style>
