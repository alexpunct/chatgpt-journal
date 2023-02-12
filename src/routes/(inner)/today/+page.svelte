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
		name: 'Today',
		description: `<span class="badge variant-soft-primary">${new Date().toLocaleDateString(
			'en-US',
			{
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			}
		)}</span>`,
		toc: false
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
		<div class="container">
			<div class="grid grid-cols-3 gap-2">
				<!-- How are you feeling? -->
				<div class="col-span-2 card variant-glass-surface p-4 shadow overflow-hidden">
					<!-- Header -->
					<header>
						<h4>Journal your day below:</h4>
					</header>
					<!-- Body -->
					<div class="p-0 md:p-4 space-y-4 mt-4">
						<textarea class="textarea" required rows="19" />
					</div>
				</div>
				<div class="col-span-1 p-4 card variant-glass-surface shadow">
					<h4 class="text-center mb-4">
						<i class="fa-solid fa-lightbulb text-lg mr-2" />
						Suggestions
					</h4>
					<hr />
					<dl class="list pl-4">
						<div class="pt-4">
							<span class="flex-auto">
								<dt class="">Physical condition</dt>
								<dd class="text-sm opacity-50">
									How are you physically? Are you tired, sick, or in pain?
								</dd>
							</span>
						</div>
						<div class="pt-4">
							<span class="flex-auto">
								<dt class="">Emotional state</dt>
								<dd class="text-sm opacity-50">
									How are you feeling emotionally? Are you feeling happy, sad, or angry?
								</dd>
							</span>
						</div>
						<div class="pt-4">
							<span class="flex-auto">
								<dt class="">How is the day so far?</dt>
								<dd class="text-sm opacity-50">
									What did you do or learned today? Anything worth mentioning?
								</dd>
							</span>
						</div>
						<div class="pt-4">
							<span class="flex-auto">
								<dt class="">What's next?</dt>
								<dd class="text-sm opacity-50">
									What are you planning to do next? Are you excited or nervous about it?
								</dd>
							</span>
						</div>
						<div class="pt-4">
							<span class="flex-auto">
								<dt class="">Feeling grateful?</dt>
								<dd class="text-sm opacity-50">Are you feeling grateful for anything today?</dd>
							</span>
						</div>
						<div class="pt-4">
							<span class="flex-auto">
								<dt class="">Goals</dt>
								<dd class="text-sm opacity-50">
									What are your long term goals and what progress have you made towards them?
								</dd>
							</span>
						</div>
					</dl>
				</div>
			</div>
			<!-- See Also -->
			<div class="card p-4 variant-glass-surface text-center w-full mt-4">
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
					<button class="btn variant-filled-primary card-hover shadow">Save new entry &rarr;</button
					>
				{/if}
			</div>
		</div>
	</svelte:fragment>
</Shell>
