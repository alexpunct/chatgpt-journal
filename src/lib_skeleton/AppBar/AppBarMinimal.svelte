<script lang="ts">
	import { browser } from '$app/environment';
	import LogoFull from '$libSkeleton/Logo/LogoFull.svelte';

	// Components
	import { AppBar } from '@skeletonlabs/skeleton';

	// Utilities
	import { LightSwitch } from '@skeletonlabs/skeleton';
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window />

<AppBar shadow="shadow-lg">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Logo -->
			<a class="lg:!ml-0 w-[38px] lg:w-auto overflow-hidden" href="/" title="Go to Homepage">
				<LogoFull />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Theme -->
		<div class="relative">
			<!-- <div class="card w-64 shadow-xl max-w-fit menu-tr sm:max-w-none" data-menu="theme"> -->
			<section class="flex justify-between items-center">
				<LightSwitch />
			</section>
		</div>
	</svelte:fragment>
</AppBar>
