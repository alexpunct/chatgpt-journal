<script lang="ts">
	// Utilities
	import { supabase } from '$lib/supabaseClient';
	import { userProfile } from '$lib/stores';

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
		description: '',
		toc: false
	};

	let content = data.savedEntry?.content || '';

	// Local
	let loading = false;
	let saved = false;

	const t: ToastSettings = {
		message: '',
		preset: 'error',
		autohide: true,
		timeout: 5000
	};

	const handleSave = async ({ target }: Event) => {
		toastStore.clear();

		try {
			loading = true;

			// save the profile
			let { data: post, error } = await supabase
				.from('journal')
				.upsert({
					// add the id if it exists
					...(data.savedEntry ? { id: data.savedEntry.id } : {}),
					user_id: data.session.user.id,
					day: new Date().toISOString().split('T')[0],
					embedding: null,
					content
				})
				.select('id');
			if (error || !post) throw error;

			setTimeout(() => {
				saved = false;
			}, 600);
		} catch (error) {
			if (error instanceof Error) {
				return toastStore.trigger({ ...t, message: error.message });
			} else {
				return toastStore.trigger({ ...t, message: 'An unknown error occurred.' });
			}
		} finally {
			supabase.functions.invoke('create-embeddings-for-all', {
				body: { name: 'Functions', customOpenAiKey: $userProfile?.profiles_private?.openai_api_key }
			});
			saved = true;
			loading = false;
		}
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
					<!-- Header -->
					<header class="text-center p-4">
						<h4 class="text-tertiary-700">
							<i class="fa-solid fa-calendar-alt text-lg mr-2" />
							{new Date().toLocaleDateString('en-US', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</h4>
					</header>
					<!-- Body -->
					<div class="p-0 md:p-3 space-y-4">
						<textarea
							use:focusTrap={true}
							class="textarea text-justify leading-6 tracking-wide max-h-60 md:max-h-max pb-4"
							required
							rows="19"
							bind:value={content}
						/>
						{#if saved}
							<div class="float-div-bottom-left text-center w-full pointer-events-none">
								<div class="flex justify-center p-1 pb-1.5">
									<div class="w-8">
										<i class="fa-solid fa-check text-xl text-success-500" />
									</div>
								</div>
							</div>
						{/if}
						{#if !saved && content && content !== data.savedEntry?.content}
							<div class="float-div-bottom-left text-center w-full pointer-events-none">
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
									<button
										on:click={handleSave}
										class="btn variant-filled-primary card-hover shadow md:opacity-60 hover:opacity-100 pointer-events-auto"
										>Save</button
									>
								{/if}
							</div>
						{/if}
					</div>
				</div>
				<div class="hidden md:block col-span-1 p-4 card variant-glass-surface shadow">
					<header class="text-center p-4">
						<h4 class="text-center mb-4">
							<i class="fa-solid fa-lightbulb text-lg mr-2" />
							Suggestions
						</h4>
					</header>
					<hr />
					<dl class="list pl-4">
						<div class="pt-2">
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
		</div>
	</svelte:fragment>
</Shell>
