<script lang="ts">
	import { userConversation } from '$lib/stores';

	// types
	import type { Message } from '$lib/types/chatTypes';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import Chat from '$lib/components/Chat/Chat.svelte';

	const handleClearConversation = () => {
		if (!confirm('Are you sure you want to clear your conversation? It will be lost forever!'))
			return;
		userConversation.set([]);
	};

	const handleAddMessage = (event: { detail: Message }) => {
		userConversation.update((conversation: Message[]) => {
			conversation.push(event.detail);
			return [...conversation];
		});
	};
</script>

<Shell
	settings={{
		name: 'Chat',
		description: '',
		toc: false
	}}
>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div class="col-span-1 md:col-span-2 md:card md:p-4 shadow overflow-hidden">
					<Chat on:addMessage={handleAddMessage} conversation={$userConversation} />
				</div>
				<div class="hidden md:block col-span-1 p-4 card variant-glass-surface shadow">
					<header class="text-center p-4">
						<h4 class="text-center mb-4">
							<i class="fa-solid fa-users text-lg mr-2" />
							Agents
						</h4>
						<ul class="space-y-4">
							<li class="card space-y-4 p-4 !bg-success-900">Therapist (active)</li>
							<li class="card space-y-4 p-4 !bg-surface-900">Comedian (coming soon)</li>
							<li class="card space-y-4 p-4 !bg-surface-900">Friend (coming soon)</li>
						</ul>
					</header>
					<div class="list px-4 text-center">
						<button
							title="Start a new conversation"
							class="btn btn-xl btn-gradient-success mt-10 mx-auto"
							on:click={handleClearConversation}
						>
							<i class="fa-solid fa-plus mr-2" />
							New Conversation
						</button>
					</div>
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
