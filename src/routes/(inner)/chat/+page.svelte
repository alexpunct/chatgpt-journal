<script lang="ts">
	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import Chat from '$lib/components/Chat/Chat.svelte';

	// Types
	import type { ShellSettings } from '$libSkeleton/Shell/types';

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
				<div class="col-span-1 md:col-span-2 md:card md:p-4 shadow overflow-hidden">
					<Chat />
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
				</div>
			</div>
		</div>
	</svelte:fragment>
</Shell>
