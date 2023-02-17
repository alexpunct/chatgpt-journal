<script lang="ts">
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';

	import { menuNavLinks } from './links';
	import { AppRail, AppRailTile, drawerStore } from '@skeletonlabs/skeleton';

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
</script>

<div
	class="grid grid-cols-[auto_1fr] h-full bg-surface-50-900-token border-r border-surface-500/30 {$$props.class ??
		''}"
>
	<!-- App Rail -->
	<AppRail
		selected={storeCategory}
		background="bg-transparent"
		border="border-r border-surface-500/50"
	>
		<AppRailTile
			label="Today"
			class="mt-3"
			value={'today'}
			tag="a"
			href="/today"
			on:click={onListItemClick}
		>
			<i class="fa-solid fa-sheet-plastic text-xl" />
		</AppRailTile>
		<AppRailTile
			label="Archive"
			value={'archive'}
			tag="a"
			href="/archive"
			on:click={onListItemClick}
		>
			<i class="fa-solid fa-book text-xl" />
		</AppRailTile>
		<hr class="opacity-30" />
		<AppRailTile label="Chat" value={'chat'} tag="a" href="/chat" on:click={onListItemClick}>
			<i class="fa-solid fa-message text-xl" />
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
</div>
