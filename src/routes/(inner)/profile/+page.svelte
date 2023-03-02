<script lang="ts">
	// Utilities
	import { invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { successToast, errorToast } from '$lib/helpers/triggerToast';

	// Components
	import Shell from '$libSkeleton/Shell/Shell.svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';

	// Types
	import type { PageData } from './$types';

	/** @type {import('./$types').ActionData} */
	export let form;

	if (form?.error) {
		errorToast(form.error);
	}

	// Data
	export let data: PageData;

	// Local
	let loading = false;
</script>

<Shell
	settings={{
		name: 'Profile',
		description: '',
		toc: false
	}}
>
	<!-- Slot: Sandbox -->
	<svelte:fragment slot="sandbox">
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					if (result.status === 200) {
						successToast(`Saved successfully!`);
						invalidate('userProfile:public');
						invalidate('userProfile:private');
					} else {
						errorToast(`Unexpected error, please try again later...`);
					}
					loading = false;
				};
			}}
			class="text-center md:text-left"
		>
			<section class="space-y-4">
				<header class="text-center mb-4">
					<h2 class="gradient-heading">Profile</h2>
				</header>
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
										class="input text-center md:text-left"
										type="text"
										placeholder="john@example.com"
										readonly
										disabled
										tabindex="-1"
										value={data.session?.user.email}
									/>
								</div>
							</label>
							<label class="label">
								<span>Avatar URL</span>
								<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
									<div class="input-group-shim">https://</div>
									<input
										class="input text-center md:text-left"
										type="text"
										name="avatar_url"
										placeholder="www.example.com"
										value={data.publicUserProfile?.avatar_url || ''}
									/>
								</div>
							</label>
						</div>
						<!-- Column 2 -->
						<div class="space-y-4">
							<label class="label">
								<span>Display name</span>
								<div class="grid-cols-[auto_1fr_auto]">
									<input
										class="input text-center md:text-left"
										type="text"
										name="full_name"
										placeholder="eg. John Smith"
										value={data.publicUserProfile?.full_name || ''}
									/>
								</div>
							</label>
						</div>
					</div>
				</div>
			</section>
			<section class="card p-4 mt-4 md:mt-12">
				<div class="flex items-center space-x-2 justify-center md:justify-start">
					<h4>OpenAI Configuration</h4>
				</div>
				<small
					>If set, you will use the most powerful AI models. Create your free API key <a
						href="https://platform.openai.com/account/api-keys"
						rel="noopener noreferrer"
						target="_blank"
						class="link">here</a
					>.</small
				>
				<div class="space-y-4 mt-4">
					<label class="label">
						<span>API Key</span>
						<input
							class="input text-center md:text-left"
							type="text"
							name="openai_api_key"
							pattern="^sk-[a-zA-Z0-9]+$"
							title="begins with sk-"
							value={data.userProfilePrivate?.openai_api_key || ''}
						/>
					</label>
				</div>
			</section>
			<!-- See Also -->
			<section class="mt-4 md:mt-12">
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
							<button class="btn btn-gradient-primary">Update Settings &rarr;</button>
						{/if}
					</div>
				</div>
			</section>
		</form>
	</svelte:fragment>
</Shell>
