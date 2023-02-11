<script lang="ts">
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import Sidebar from './Sidebar.svelte';

	$: classesDrawer = $drawerStore.id === 'doc-sidenav' ? 'lg:hidden' : '';
</script>

<Drawer class={classesDrawer}>
	{#if $drawerStore.id === 'doc-sidenav'}
		<!-- Doc Sidebar -->
		<Sidebar embedded={true} />
	{:else if $drawerStore.id === 'demo'}
		<!-- Drawer Doc Demos -->
		<div class="w-full h-full flex justify-center items-center">
			<div class="text-center space-y-2">
				{#if $drawerStore.meta}<h2>{$drawerStore.meta}</h2>{/if}
				<h4>Drawer: <span class="capitalize">{$drawerStore.position}</span></h4>
				<span class="block">Tap outside the drawer to close.</span>
			</div>
		</div>
	{/if}
</Drawer>
