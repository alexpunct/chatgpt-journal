<figure>
	<section class="img-bg" />
	<img src="chatjournal-logo-no-bg-large.webp" class="mr-2 w-auto" alt="Chat Journal" />
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
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 15s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-success-400/10;
		}
		33% {
			@apply bg-primary-400/30;
		}
		66% {
			@apply bg-secondary-400/20;
		}
		100% {
			@apply bg-success-400/10;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.2);
		}
	}
</style>
