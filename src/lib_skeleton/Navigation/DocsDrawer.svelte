<script lang="ts">
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import Sidebar from './Sidebar.svelte';

	$: classesDrawer = $drawerStore.id === 'left-sidenav' ? 'md:hidden' : '';
</script>

<Drawer width="70px" class={classesDrawer}>
	{#if $drawerStore.id === 'left-sidenav'}
		<!-- Doc Sidebar -->
		<Sidebar embedded={true} />
	{/if}
</Drawer>
