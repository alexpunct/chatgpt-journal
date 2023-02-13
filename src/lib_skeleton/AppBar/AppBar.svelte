<script lang="ts">
	import { browser } from '$app/environment';
	import type { SubmitFunction } from '$app/forms';
	import { supabase } from '$lib/supabaseClient';

	// Types
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	// Components
	import { AppBar } from '@skeletonlabs/skeleton';
	import LogoFull from '../Logo/LogoFull.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	// Utilities
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { menu } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

	// Stores
	import { userProfile } from '$lib/stores';
	import { drawerStore } from '@skeletonlabs/skeleton';

	// Local
	let isOsMac = false;

	// Set Search Shortkey Keys
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'doc-sidenav' };
		drawerStore.open(s);
	}

	async function signOut() {
		try {
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window />

<AppBar padding="p-2 pl-4 pr-4" shadow="shadow-lg">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4">
			<!-- Hamburger Menu -->
			<button on:click={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
				<i class="fa-solid fa-bars text-xl" />
			</button>
			<!-- Logo -->
			<a class="lg:!ml-0 w-[38px] lg:w-auto overflow-hidden" href="/" title="Go to Homepage">
				<LogoFull />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Navigate -->
		<div class="relative hidden lg:block">
			<button class="btn hover:variant-soft-primary" use:menu={{ menu: 'user' }}>
				{#if $userProfile}
					<Avatar
						width="w-8"
						rounded="rounded-xl"
						src={$userProfile ? 'https://' + $userProfile.avatar_url : 'https://i.pravatar.cc/'}
					/>
					<span>{$userProfile.full_name}</span>
				{:else}
					<span>Manage profile</span>
				{/if}
				<i class="fa-solid fa-caret-down opacity-50" />
			</button>
			<!-- prettier-ignore -->
			<div class="card p-4 w-60 shadow-xl" data-menu="user">
				<nav class="list-nav">
					<ul>
						<li>
							<a href="/profile">
								<span class="w-6 text-center"><i class="fa-solid fa-user" /></span>
								<span>Profile</span>
							</a>
							<hr class="my-4">
							<a href="/logout" on:click|preventDefault={signOut}>
								<span class="w-6 text-center"><i class="fa-solid fa-right-from-bracket" /></span>
								<span>Log Out</span>
							</a>
						</li>
					</ul>
				</nav>
			</div>
		</div>

		<!-- Theme -->
		<div class="relative">
			<!-- <div class="card w-64 shadow-xl max-w-fit menu-tr sm:max-w-none" data-menu="theme"> -->
			<section class="flex justify-between items-center">
				<LightSwitch />
			</section>
		</div>
		<div />
	</svelte:fragment>
</AppBar>
