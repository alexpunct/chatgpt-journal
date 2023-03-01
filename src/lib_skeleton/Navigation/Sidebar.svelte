<script lang="ts">
	import { page } from '$app/stores';
	import { writable, type Writable } from 'svelte/store';

	import { menuNavLinks } from './links';
	import { AppRail, AppRailTile, drawerStore } from '@skeletonlabs/skeleton';

	// Props
	export let embedded = false;

	// Local
	const storeCategory: Writable<string> = writable('today');
	let filteredMenuNavLinks: any[] = menuNavLinks;

	// ListItem Click Handler
	function onListItemClick(): void {
		// On Drawer embed Only:
		if (!embedded) return;
		drawerStore.close();
	}

	function setNavCategory(c: string): void {
		storeCategory.set(c);

		switch ($storeCategory) {
			case 'journal/today':
				filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'today');
				break;
			case 'journal':
				filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'journal');
				break;
			case 'chatbot':
				filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'chatbot');
				break;
			case 'profile':
				filteredMenuNavLinks = menuNavLinks.filter((linkSet: any) => linkSet.id === 'profile');
				break;
		}
	}

	// Lifecycle
	page.subscribe((p) => {
		let pathMatch: string = p.url.pathname.split('/')[1];
		let subpagePathMatch: string = p.url.pathname.split('/')[2];
		if (!pathMatch) return;
		if (subpagePathMatch && subpagePathMatch === 'today') {
			pathMatch = 'journal/today';
		}
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
		regionDefault="flex justify-center flex-col space-y-8"
	>
		<AppRailTile
			label="Today"
			value={'journal/today'}
			tag="a"
			href="/journal/today"
			on:click={onListItemClick}
		>
			<i class="fa-solid fa-sheet-plastic text-xl" />
		</AppRailTile>
		<AppRailTile
			label="Archive"
			value={'journal'}
			tag="a"
			href="/journal"
			on:click={onListItemClick}
		>
			<i class="fa-solid fa-book text-xl" />
		</AppRailTile>
		<AppRailTile label="Chat" value={'chat'} tag="a" href="/chat" on:click={onListItemClick}>
			<i class="fa-solid fa-message text-xl" />
		</AppRailTile>
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
