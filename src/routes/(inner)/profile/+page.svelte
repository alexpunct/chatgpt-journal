<script lang="ts">
	// Utilities
	import { supabase } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import { ProgressRadial, focusTrap, toastStore } from '@skeletonlabs/skeleton';

	// Types
	import type { ShellSettings } from '$libSkeleton/Shell/types';
	import type { PageData } from './$types';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	// Data
	export let data: PageData;

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
	let loading = false;
	let avatarUrl: string | null = data.profile.avatar_url || null;
	let fullName: string | null = data.profile.full_name || null;
	let openAiApiKey: string | null = data.profilePrivate.openai_api_key || null;

	const t: ToastSettings = {
		message: '',
		preset: 'error',
		autohide: true,
		timeout: 5000
	};

	const dataChanged = () => {
		return (
			avatarUrl !== data.profile.avatar_url ||
			fullName !== data.profile.full_name ||
			openAiApiKey !== data.profilePrivate.openai_api_key
		);
	};

	const handleSave = async ({ target }: Event) => {
		toastStore.clear();
		if (!openAiApiKey) {
			return toastStore.trigger({ ...t, message: 'Please enter you OpenAI API Key.' });
		}
		if (!dataChanged()) {
			return toastStore.trigger({ ...t, message: 'No changes to save.', preset: 'warning' });
		}
		try {
			loading = true;
			if (avatarUrl) avatarUrl = avatarUrl?.replace('http://', '').replace('https://', '');

			// save the profile
			let { data: profile, error } = await supabase
				.from('profiles')
				.upsert({
					id: data.profile.id,
					avatar_url: avatarUrl,
					full_name: fullName
				})
				.select('id');
			if (error || !profile) throw error;

			// save the private profile
			({ error } = await supabase.from('profiles_private').upsert({
				id: data.profilePrivate.id ?? profile[0].id,
				openai_api_key: openAiApiKey
			}));
			if (error) throw error;
			return toastStore.trigger({
				...t,
				message: 'Profile updated!',
				preset: 'success'
			});
		} catch (error) {
			if (error instanceof Error) {
				return toastStore.trigger({ ...t, message: error.message });
			} else {
				return toastStore.trigger({ ...t, message: 'An unknown error occurred.' });
			}
		} finally {
			loading = false;
			invalidate('app:profile');
		}
	};
</script>

<Shell {settings}>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<form use:focusTrap={true} on:submit|preventDefault={handleSave}>
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
										disabled
										tabindex="-1"
										value={data.profile.email}
									/>
								</div>
							</label>
							<label class="label">
								<span>Avatar URL</span>
								<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
									<div class="input-group-shim">https://</div>
									<input
										class="input"
										type="text"
										placeholder="www.example.com"
										bind:value={avatarUrl}
									/>
								</div>
							</label>
						</div>
						<!-- Column 2 -->
						<div class="space-y-4">
							<label class="label">
								<span>Full name</span>
								<div class="grid-cols-[auto_1fr_auto]">
									<input
										class="input"
										type="text"
										placeholder="eg. John Smith"
										bind:value={fullName}
									/>
								</div>
							</label>
						</div>
					</div>
				</div>
			</section>
			<section class="card variant-ghost-warning p-4 mt-12">
				<div class="flex items-center space-x-2">
					<h2>OpenAI Configuration</h2>
					<span class="badge variant-filled-warning">Required</span>
				</div>
				<div class="space-y-4">
					<label class="label">
						<span>API Key</span>
						<input
							class="input"
							bind:value={openAiApiKey}
							type="password"
							required
							pattern="^sk-[a-zA-Z0-9]+$"
							title="begins with sk-"
						/>
					</label>
				</div>
			</section>
			<!-- See Also -->
			<section class="mt-12">
				<div class="grid grid-cols-1 gap-4">
					<div class="card p-4 variant-glass-surface text-center">
						{#if loading}
							<div class="flex justify-center p-1 pb-1.5">
								<div class="w-8">
									<ProgressRadial
										stroke={150}
										meter="stroke-primary-500"
										track="stroke-primary-500/30"
									/>
								</div>
							</div>
						{:else}
							<button class="btn variant-filled-primary">Update Settings &rarr;</button>
						{/if}
					</div>
				</div>
			</section>
		</form>
	</svelte:fragment>
</Shell>
