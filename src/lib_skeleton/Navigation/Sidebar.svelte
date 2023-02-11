<script lang="ts">
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';

	import SvgIcon from '../SvgIcon/SvgIcon.svelte';
	import { menuNavLinks } from './links';
	import { AppRail, AppRailTile, drawerStore } from '@skeletonlabs/skeleton';

	// Stores
	import { storeCurrentUrl } from '$lib/stores';

	// Props
	export let embedded = false;

	// Local
	const storeCategory: Writable<string> = writable('today'); // guides | docs | tailwind | svelte | utilities
	let filteredMenuNavLinks: any[] = menuNavLinks;

	// ListItem Click Handler
	function onListItemClick(): void {
		// On Drawer embed Only:
		if (!embedded) return;
		drawerStore.close();
	}

	function setNavCategory(c: string): void {
		storeCategory.set(c);
		// prettier-ignore
		switch($storeCategory) {
			case('today'): filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'today'); break;
			case('archive'): filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'archive'); break;
			case('chatbot'): filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'chatbot'); break;
			case('profile'): filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'profile'); break;
		}
	}

	// Lifecycle
	page.subscribe((p) => {
		let pathMatch: string = p.url.pathname.split('/')[1];
		if (!pathMatch) return;
		if (['components', 'actions'].includes(pathMatch)) pathMatch = 'svelte';
		setNavCategory(pathMatch);
	});
	storeCategory.subscribe((c: string) => setNavCategory(c));

	// Reactive
	$: classesActive = (href: string) =>
		$storeCurrentUrl?.includes(href) ? 'bg-primary-active-token' : '';

	let submenu = false;
	let sidebarWidth = '';

	if (submenu) {
		sidebarWidth = 'w-[360px]';
	}
</script>

<div
	class="{sidebarWidth} grid grid-cols-[auto_1fr] pt-4 h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<!-- App Rail -->
	<AppRail
		selected={storeCategory}
		background="bg-transparent"
		border="border-r border-surface-500/30"
	>
		<AppRailTile label="Today" value={'today'} tag="a" href="/today">
			<i class="fa-solid fa-sheet-plastic text-2xl" />
		</AppRailTile>
		<AppRailTile label="Archive" value={'archive'} tag="a" href="/archive">
			<i class="fa-solid fa-book text-2xl" />
		</AppRailTile>
		<hr class="opacity-30" />
		<AppRailTile label="Chat" value={'chat'} tag="a" href="/chat">
			<i class="fa-solid fa-message text-2xl" />
		</AppRailTile>
		<hr class="opacity-30" />
		<svelte:fragment slot="trail">
			<AppRailTile
				label="Settings"
				tag="a"
				href="/profile"
				value={'profile'}
				on:click={onListItemClick}
			>
				<i class="fa-solid fa-gears text-xl" />
			</AppRailTile>
		</svelte:fragment>
	</AppRail>
	{#if submenu}
		<!-- Nav Links -->
		<section class="p-4 pb-20 space-y-4 overflow-y-auto">
			{#each filteredMenuNavLinks as { id, title, list }, i}
				{#if list.length > 0}
					<!-- Title -->
					<div {id} class="text-primary-700 dark:text-primary-500 font-bold uppercase px-4">
						{title}
					</div>
					<!-- Navigation List -->
					<nav class="list-nav">
						<ul>
							{#each list as { href, label, badge }}
								<li on:click={onListItemClick} on:keypress>
									<a {href} class={classesActive(href)} data-sveltekit-preload-data="hover">
										<span class="flex-auto">{@html label}</span>
										{#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if}
									</a>
								</li>
							{/each}
						</ul>
					</nav>
					<!-- Divider -->
					{#if i + 1 < filteredMenuNavLinks.length}<hr class="!my-6 opacity-50" />{/if}
				{/if}
			{/each}
		</section>
	{/if}
</div>
