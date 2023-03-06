<script lang="ts">
	import { userConversation, activeAgent } from '$lib/stores';

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

	const handleChangeAgent = (agentId: string) => {
		activeAgent.set(agentId);
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
				<div class="col-span-1 md:col-span-2">
					<Chat
						on:addMessage={handleAddMessage}
						conversation={$userConversation}
						activeAgent={$activeAgent}
					/>
				</div>
				<div
					class="md:block col-span-1 md:p-4 card variant-soft-surface max-h-[500px] ml-2 xl:ml-16 pb-16"
				>
					<header class="text-center p-2 md:p-4">
						<h4 class="text-center mb-4">
							<i class="fa-solid fa-comment text-lg mr-2" />
							Chat with:
						</h4>
						<ul class="space-y-4">
							<li class="">
								<button
									class="card space-y-4 p-4 w-full {$activeAgent === '1' ? '!bg-surface-500' : ''}"
									title="Therapist"
									on:click={handleChangeAgent.bind(null, '1')}
								>
									A therapist
								</button>
							</li>
							<li class="">
								<button
									class="card space-y-4 p-4 w-full {$activeAgent === '2' ? '!bg-surface-500' : ''}"
									title="Comedian"
									on:click={handleChangeAgent.bind(null, '2')}
								>
									A comedian
								</button>
							</li>
							<li class="">
								<button
									class="card space-y-4 p-4 w-full {$activeAgent === '5' ? '!bg-surface-500' : ''}"
									title="George from Seinfeld"
									on:click={handleChangeAgent.bind(null, '5')}
								>
									A trader
								</button>
							</li>
							<li class="">
								<button
									class="card space-y-4 p-4 w-full {$activeAgent === '3' ? '!bg-surface-500' : ''}"
									title="Albert Einstein"
									on:click={handleChangeAgent.bind(null, '3')}
								>
									Albert Einstein
								</button>
							</li>
							<li class="">
								<button
									class="card space-y-4 p-4 w-full {$activeAgent === '4' ? '!bg-surface-500' : ''}"
									title="George from Seinfeld"
									on:click={handleChangeAgent.bind(null, '4')}
								>
									George from Seinfeld
								</button>
							</li>
						</ul>
					</header>
					<div class="list px-4 pb-6 text-center">
						<button
							title="Start a new conversation"
							class="btn p-0 lg:p-4 xl:btn-xl btn-gradient-surface mx-auto"
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
