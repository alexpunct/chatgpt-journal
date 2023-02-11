<script>
	import { page } from '$app/stores';
	import Account from '$lib/Auth/Account.svelte';
</script>

<Account session={$page.data.session} />
