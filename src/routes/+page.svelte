<script lang="ts">
	// Components
	import DocsLogoAnim from '$libSkeleton/Logo/DocsLogoAnim.svelte';

	// export const prerender = true;

	// Stores
	import { page } from '$app/stores';
</script>

<div>
	<!-- Hero -->
	<header
		class="variant-glass-surface border-b border-black/5 dark:border-white/5 px-4 py-10 md:py-20"
	>
		<div
			class="container max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 place-items-center md:text-left text-center"
		>
			<!-- Text -->
			<div class="space-y-4 tracking-wide">
				<h1>
					<span class="gradient-heading font-medium text-5xl "
						><small>Chat with GPT as you Journal</small>
					</span>
				</h1>
				<!-- <h2 class="md:text-4xl">Private and intelligent.</h2> -->
				<div class="text-2xl pb-4 pt-8 md:pt-0 tracking-wide leading-10 font-light">
					The AI-powered journaling app that helps you
					<span class="badge variant-soft-primary text-2xl px-4 pb-2">write</span>
					<span class="badge variant-soft-secondary text-2xl px-4 pb-2">reflect</span> and
					<span class="badge variant-soft-success text-2xl px-4 pb-2">connect</span><br />
				</div>
				<nav class="md:flex space-x-4 text-center md:text-left">
					{#if $page.data.session}
						<a href="/journal/today" class="btn btn-gradient-primary">
							<span>Go to App</span>
							<span>&rarr;</span>
						</a>
					{:else}
						<a href="/auth/signup" class="btn btn-gradient-primary">
							<span>Get Started for FREE</span>
							<span>&rarr;</span>
						</a>
						<a href="/auth/signin" class="btn variant-ghost-surface">Sign in</a>
					{/if}
				</nav>
			</div>
			<!-- Logo -->
			<DocsLogoAnim />
		</div>
	</header>

	<div
		class="container max-w-[1200px] mx-auto px-4 py-10 md:py-20 space-y-20 text-center md:text-left"
	>
		<div class="p-4 max-w-2xl mx-auto">
			<span class="text-xl italic">
				Chat Journal is more than just a diary. It's a smart and friendly companion that helps you
				express yourself, understand your emotions and chat with your personal AI coach.
			</span>
		</div>

		<!-- Features -->
		<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			<h2 class="sr-only">Features</h2>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-primary-800 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<div style="w-10 h-10">
						<span class="fas fa-feather-pointed text-3xl" />
					</div>
				</div>
				<h4>Journal like a PRO</h4>
				<p>Get suggestions on what to write about and feedback on what you already wrote</p>
			</div>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-secondary-800 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<span class="fas fa-seedling text-3xl" />
				</div>
				<h4>ChatGPT that knows YOU</h4>
				<p>It uses your journal entries and past conversations as context when chatting with you</p>
			</div>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-tertiary-800 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<span class="fas fa-code-branch text-3xl" />
				</div>
				<h4>Varied outputs</h4>
				<p>
					Choose from a wide range of agents to chat with. Examples: a therapist, a comedian, a
					friend, etc.
				</p>
			</div>
			<div class="card variant-glass-surface p-4 text-center space-y-4">
				<div
					class="bg-success-800 w-20 mx-auto lg:-mt-10 aspect-square flex justify-center items-center rounded-token shadow"
				>
					<span class="fas fa-file-shield text-3xl" />
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
