<script lang="ts">
	import '../theme.postcss';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell, AppRail, AppRailTile, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	// import AppBar from '$lib/AppBar/AppBar.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';

	const selectedPage: Writable<number> = writable(1);
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="header">
		<!-- <AppBar /> -->
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<Avatar src="chatjournal-logo-no-bg.png" class="mr-2" />
				<strong class="text-xl uppercase">Chat Journal</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<section class="flex justify-between items-center">
					<LightSwitch />
				</section>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<AppRail width={'w-auto sm:w-25'} selected={selectedPage}>
			<svelte:fragment slot="lead" />

			<!-- AppRailTiles -->
			<!-- Default -->
			<AppRailTile href="/" label="Home" value={1}>
				<i class="fa-solid fa-igloo text-3xl" />
			</AppRailTile>
			<AppRailTile href="/chat" label="Chat" value={2}>
				<i class="fa-solid fa-message text-3xl" />
			</AppRailTile>
			<AppRailTile href="/journal" label="Journal" value={3}>
				<i class="fa-solid fa-book text-3xl" />
			</AppRailTile>

			<svelte:fragment slot="trail">
				<AppRailTile href="/settings" title="Settings" value={4}>
					<i class="fa-solid fa-sliders text-2xl" />
				</AppRailTile>
			</svelte:fragment>
		</AppRail>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>

<style lang="postcss">
	figure {
		@apply flex relative flex-col;
	}
	figure img,
	.img-bg {
		@apply w-32 h-32 md:w-60 md:h-60;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.2);
		}
	}
</style>
