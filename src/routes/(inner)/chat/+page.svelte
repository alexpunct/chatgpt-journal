<script lang="ts">
	// Utilities
	import { supabase } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import { ProgressRadial, focusTrap, toastStore } from '@skeletonlabs/skeleton';
	import Chat from '$lib/components/Chat/Chat.svelte';

	// Types
	import type { ShellSettings } from '$libSkeleton/Shell/types';
	import type { PageData } from './$types';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	//  Shell
	const settings: ShellSettings = {
		name: 'Chat',
		description: '',
		toc: false
	};
</script>

<Shell {settings}>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<div class="container">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div
					class="col-span-1 md:col-span-2 md:card md:variant-glass-surface md:p-4 shadow overflow-hidden"
				>
					<Chat />
					<aside class="alert variant-soft-warning mt-8">
						<!-- Icon -->
						<div><i class="fa fa-warning text-3xl" /></div>
						<!-- Message -->
						<div class="alert-message">
							<h3>Chatbot Model</h3>
							<p>
								Currently you are using the 'text-curie-001' OpenAi model.
								<br />To use the most powerful 'text-davinci-003', please set your own OpenAi key in
								the Settings.
							</p>
						</div>
					</aside>
				</div>
				<div class="hidden md:block col-span-1 p-4 card variant-glass-surface shadow">
					<header class="text-center p-4">
						<h4 class="text-center mb-4">
							<i class="fa-solid fa-users text-lg mr-2" />
							Agents
						</h4>
						<ul class="space-y-4">
							<li class="card space-y-4 p-4 !bg-success-900">Psychologist (active)</li>
							<li class="card space-y-4 p-4 !bg-surface-900">Comedian (coming soon)</li>
							<li class="card space-y-4 p-4 !bg-surface-900">Friend (coming soon)</li>
						</ul>
					</header>
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
