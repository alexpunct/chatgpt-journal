<script lang="ts">
	import { browser } from '$app/environment';
	import { supabase } from '$lib/supabaseClient';

	// Types
	import type { DrawerSettings } from '@skeletonlabs/skeleton';

	// Components
	import { AppBar } from '@skeletonlabs/skeleton';
	import LogoFull from '../Logo/LogoFull.svelte';

	// Utilities
	import { popup } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	// Stores
import { userProfile } from '$lib/stores';
import { drawerStore } from '@skeletonlabs/skeleton';
import { modelPricing } from '$lib/constants/modelPricing';

       // Local
       let isOsMac = false;
       let tokensMonth = 0;
       let tokensTotal = 0;

       const costPerToken = modelPricing['gpt-4.1-nano'].input;

	onMount(async () => {
		const res = await fetch('/api/userProfile/private');
		if (res.ok) {
			const { data } = await res.json();
			tokensMonth = data?.tokens_used_month ?? 0;
			tokensTotal = data?.tokens_used_total ?? 0;
		}
	});

	// Set Search Shortkey Keys
	if (browser) {
		let os = navigator.userAgent;
		isOsMac = os.search('Mac') !== -1;
	}

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'left-sidenav' };
		drawerStore.open(s);
	}

	async function signOut() {
		try {
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
			window.location.replace('/');
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	}
</script>

<!-- NOTE: using stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window />

<AppBar padding="p-2 pl-4 pr-4 relative z-20" shadow="shadow-lg">
	<svelte:fragment slot="lead">
		<div class="flex items-center space-x-4 min-w-[200px]">
			<!-- Hamburger Menu -->
			<button on:click={drawerOpen} class="btn-icon btn-icon-sm lg:!hidden">
				<i class="fa-solid fa-bars text-xl" />
			</button>
			<!-- Logo -->
			<a class="" href="/" title="Go to Homepage">
				<LogoFull />
			</a>
		</div>
	</svelte:fragment>
	<svelte:fragment slot="trail">
		<!-- Navigate -->
		<div class="relative">
			<button class="btn hover:variant-soft-primary" use:popup={{ event: 'click', target: 'user' }}>
				{#if $userProfile && $userProfile.avatar_url}
					<img
						class="w-8 rounded-xl"
						id="currentPhoto"
						src={'https://' + $userProfile.avatar_url}
						onerror="this.onerror=null; this.src='/icons8-customer-96.png'"
						alt=""
						width="64"
						height="64"
					/>

					<span class="hidden md:block">{$userProfile.full_name}</span>
				{:else}
					<span>Profile</span>
				{/if}
				<i class="fa-solid fa-caret-down opacity-50" />
			</button>
			<!-- prettier-ignore -->
			<div class="card p-4 w-60 shadow-xl" data-popup="user">
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
                                <div class="mt-2 text-sm">
                                        <p>Tokens this month: {tokensMonth}</p>
                                        <p>Estimated cost: ${(tokensMonth * costPerToken).toFixed(4)}$</p>
                                        <p class="mt-1">Total tokens: {tokensTotal}</p>
                                </div>
			</div>
		</div>
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
