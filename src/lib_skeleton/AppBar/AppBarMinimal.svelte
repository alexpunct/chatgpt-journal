<script lang="ts">
	import { browser } from '$app/environment';

	// Types
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	//
	import LogoFull from '$libSkeleton/Logo/LogoFull.svelte';
	import Search from '$libSkeleton/Search/Search.svelte';

	// Components
	import { AppBar } from '@skeletonlabs/skeleton';
	// Utilities
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { menu } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

	// Stores
	import { storeTheme } from '$lib/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';

	// Local
	let isOsMac = false;

	// Set Search Shortkey Keys
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}
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
