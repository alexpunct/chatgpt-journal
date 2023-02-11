<script lang="ts">
	// Docs
	import DocsLogoAnim from '$libSkeleton/Logo/DocsLogoAnim.svelte';
</script>

<div>
	<!-- Hero -->
	<header
		class="variant-glass-surface border-b border-black/5 dark:border-white/5 px-4 py-10 md:py-20"
	>
		<div
			class="container max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center md:text-left sm:text-center"
		>
			<!-- Text -->
			<div class="space-y-4">
				<h1>
					<span class="gradient-heading font-bold text-5xl"
						><small>Your journal + ChatGPT = </small><br /><strong>ChatJournal.Ai</strong></span
					>
				</h1>
				<!-- <h2 class="md:text-4xl">Private and intelligent.</h2> -->
				<p class="md:!text-lg">
					Journal, chat and have fun with our many <i class="fa fa-robot" />
				</p>
				<nav class="flex space-x-4">
					<a href="/journal" class="btn variant-filled-primary">
						<span>Get Started for FREE</span>
						<span>&rarr;</span>
					</a>
					<!-- <a href="/" class="btn variant-ghost-surface">Coming Soon!</a> -->
				</nav>
			</div>
			<!-- Logo -->
			<DocsLogoAnim />
		</div>
	</header>

	<div class="container max-w-[1200px] mx-auto px-4 py-10 md:py-20 space-y-20">
		<!-- Pre-Release Alert -->
		<aside class="alert variant-ghost-warning text-center">
			<i class="fa-solid fa-triangle-exclamation text-4xl" />
			<div class="alert-message">
				Working hard to make this happen! If you want to join early or discuss with the team >
			</div>
			<div class="alert-actions">
				<a
					href="https://discord.gg/REYCS3HuM4"
					target="_blank"
					rel="noreferrer"
					class="btn variant-filled">Join Discord</a
				>
			</div>
		</aside>

		<!-- Features -->
		<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<h2 class="sr-only">Features</h2>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-green-600 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<div style="w-10 h-10">
						<span class="fas fa-check-to-slot text-3xl" />
					</div>
				</div>
				<h4>Journal like a PRO</h4>
				<p>Get suggestions on what to write about and feedback on what you already wrote</p>
			</div>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-sky-500 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<span class="fas fa-check-to-slot text-3xl" />
				</div>
				<h4>ChatGPT that knows YOU</h4>
				<p>It uses your journal entries and past conversations as context when chatting with you</p>
			</div>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-primary-500 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<span class="fas fa-check-to-slot text-3xl" />
				</div>
				<h4>Varied outputs</h4>
				<p>
					Choose from a wide range of agents to chat with. Examples: a therapist, a comedian, a
					friend, etc.
				</p>
			</div>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-secondary-500 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<span class="fas fa-check-to-slot text-3xl" />
				</div>
				<h4>Private, Fast and Secure</h4>
				<p>
					We don't share any data with 3rd parties. <br />Optionally you to use your own storage
					(addon)
				</p>
			</div>
		</section>
	</div>
</div>
