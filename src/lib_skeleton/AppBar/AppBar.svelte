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
	import Search from '../Search/Search.svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

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

	// Drawer Handler
	function drawerOpen(): void {
		const s: DrawerSettings = { id: 'doc-sidenav' };
		drawerStore.open(s);
	}

	// Search
	function triggerSearch(): void {
		const modalComponent: ModalComponent = { ref: Search };
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			backdropClasses: '!items-start',
			modalClasses:
				'!bg-surface-100/60 dark:!bg-surface-800/60 backdrop-blur-lg border border-surface-500/50 !p-0 xl:!max-w-[700px]'
		};
		modalStore.trigger(d);
	}

	// Keyboard Shortcut (CTRL/⌘+K) to Focus Search
	function onWindowKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			// Prevent default browser behavior of focusing URL bar
			e.preventDefault();
			// If modal currently open, close modal (allows to open/close search with CTRL/⌘+K)
			$modalStore.length ? modalStore.close() : triggerSearch();
		}
	}

	const themes = [
		{ type: 'chatjournal', name: 'Default', icon: '' },
		{ type: 'modern', name: 'Playful', icon: '' },
		{ type: 'crimson', name: 'Serious', icon: '' }
	];

	const setTheme: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				const theme = result.data?.theme as string;
				storeTheme.set(theme);
			}
		};
	};

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
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />

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
		<!-- Search -->
		<!-- <div class="md:inline md:ml-4 mr-4">
			<button
				class="btn btn-sm variant-ghost-surface hidden lg:inline-block"
				on:click={triggerSearch}
			>
				<i class="fa-solid fa-magnifying-glass" />
				<span class="hidden lg:inline-block">Search journal</span>
				<span class="hidden lg:inline-block text-[11px] font-bold opacity-60 pl-2"
					>{isOsMac ? '⌘' : 'Ctrl'}+K</span
				>
			</button>
		</div> -->

		<!-- Navigate -->
		<div class="relative hidden lg:block">
			<button class="btn hover:variant-soft-primary" use:menu={{ menu: 'user' }}>
				<Avatar width="w-8" rounded="rounded-xl" src="https://i.pravatar.cc/" />
				<span>Alex</span>
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
							<!-- <a href="/billing">
								<span class="w-6 text-center"><i class="fa-solid fa-money-check-dollar" /></span>
								<span>Billing</span>
							</a> -->
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
