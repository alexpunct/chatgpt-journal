<script lang="ts">
	import LogoFull from '$libSkeleton/Logo/LogoFull.svelte';

	// Components
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window />

<AppBar padding="p-4" shadow="shadow-lg">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Logo -->
			<a class="" href="/" title="Go to Homepage">
				<LogoFull />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Social -->
		<!-- prettier-ignore -->
		<section class="flex space-x-1">
			<a class="btn-icon btn-icon-sm hover:variant-soft-primary" href="https://discord.gg/REYCS3HuM4" target="_blank" rel="noreferrer">
				<i class="fa-brands fa-discord text-lg" />
			</a>
			<a class="btn-icon btn-icon-sm hover:variant-soft-primary" href="https://github.com/alexpunct/chatgpt-journal" target="_blank" rel="noreferrer">
				<i class="fa-brands fa-github text-lg" />
			</a>
		</section>
	</svelte:fragment>
</AppBar>
