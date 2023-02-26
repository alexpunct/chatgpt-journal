<script lang="ts">
	import LogoFull from '$libSkeleton/Logo/LogoFull.svelte';

	// Components
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window />

<AppBar padding="p-2 pl-4 pr-4" shadow="shadow-lg">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Logo -->
			<a class="" href="/" title="Go to Homepage">
				<LogoFull />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail" />
</AppBar>
