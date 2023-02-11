<script lang="ts">
	import { page } from '$app/stores';
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import type { ShellSettings } from '$libSkeleton/Shell/types';

	import { CodeBlock } from '@skeletonlabs/skeleton';

	//  Shell
	const settings: ShellSettings = {
		name: 'Profile',
		description: '',
		toc: false,
		classes: [
			['<code>.legend</code>', '', 'Provides theme styles to legend elements.'],
			['<code>.label</code>', '', 'Provides theme styles to label elements.'],
			['<code>.input</code>', '', 'Provides theme styles to input elements.'],
			['<code>.textarea</code>', '', 'Provides theme styles to textarea elements.'],
			['<code>.select</code>', '', 'Provides theme styles to select elements.'],
			['<code>.checkbox</code>', '', 'Provides theme styles to checkbox elements.'],
			['<code>.radio</code>', '', 'Provides theme styles to radio elements.'],
			['<code>.input-group</code>', '', 'Creates a group of related inputs and information.'],
			['<code>.input-group-divider</code>', '', 'Adds vertical lines between group segments.'],
			['<code>.input-group-shim</code>', '', 'Provides a shaded background segment.'],
			[
				'<code>.input-[variant]</code>',
				'succes | warning | error',
				'Color highlights for input for validation states.'
			]
		]
	};

	// Local
	let colorValue = '#bada55';
</script>

<Shell {settings}>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<section class="space-y-4">
			<div class="card">
				<!-- Card Body -->
				<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Column 1 -->
					<div class="space-y-4">
						<label class="label">
							<span>Email (readonly)</span>
							<!-- NOTE: we recommend setting the tabindex to -1 as well -->
							<div class="input-group-divider grid-cols-[auto_1fr_auto] pt-1">
								<input
									class="input"
									type="text"
									placeholder="john@example.com"
									readonly
									tabindex="-1"
								/>
							</div>
						</label>
					</div>
					<!-- Column 2 -->
					<div class="space-y-4">
						<label class="label">
							<span>Avatar URL</span>
							<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
								<div class="input-group-shim">https://</div>
								<input type="text" placeholder="www.example.com" />
							</div>
						</label>
					</div>
				</div>
			</div>
		</section>
	</svelte:fragment>

	<!-- Slot: Usage -->
	<svelte:fragment slot="usage">
		<section class="card variant-ghost-warning p-4 space-y-4">
			<div class="flex items-center space-x-2">
				<h2>OpenAI Configuration</h2>
				<span class="badge variant-filled-warning">Required</span>
			</div>
			<div class="space-y-4">
				<label class="label">
					<span>API Key</span>
					<input class="input" type="password" tabindex="-1" required />
				</label>
			</div>
		</section>
		<!-- See Also -->
		<section class="space-y-4">
			<div class="grid grid-cols-1 gap-4">
				<div class="card p-4 variant-glass-surface text-center">
					<button class="btn variant-filled-primary">Update Settings &rarr;</button>
				</div>
			</div>
		</section>
	</svelte:fragment>
</Shell>
