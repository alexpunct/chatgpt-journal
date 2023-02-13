<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
</script>

<!-- Source: https://twitter.com/_davideast/status/1586091388826886145 -->
<!-- https://fjolt.com/article/css-3d-interactive-flippable-cards -->
<figure>
	<section class="img-bg" />
	<img src="chatjournal-logo-no-bg-large.png" class="mr-2 w-auto" alt="Chat Journal" />
</figure>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure img,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		/* animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite; */
	}
	/* @keyframes glow {
		0% {
			@apply bg-secondary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-primary-400/50;
		}
		100% {
			@apply bg-secondary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.2);
		}
	} */
</style>
