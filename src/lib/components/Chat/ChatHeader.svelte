<script lang="ts">
	// This "exported" variable can be changed (it's a prop!)
	export let title = 'Chat'; // "Chat" is the default prop value

	// This one is scoped to the component (it can't be changed from outside)
	// export let messageCount = 0;
</script>

<div class="root clearfix text-center pb-4">
	<div class="about">
		<div class="with">{title}</div>
		<!-- <div class="num-messages">
			already {messageCount > 1 ? `${messageCount} messages` : `${messageCount} message`}
		</div> -->
	</div>
</div>

<style>
	/* ... */
</style>
