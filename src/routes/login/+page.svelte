<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { ProgressRadial, focusTrap, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	let loading = false;
	let email: string;

	const t: ToastSettings = {
		message: '',
		preset: 'error',
		autohide: true,
		timeout: 5000
	};

	const handleLogin = async ({ target }: Event) => {
		toastStore.clear();
		if (!email) {
			return toastStore.trigger({ ...t, message: 'Please enter an email address.' });
		}
		try {
			loading = true;
			const { error } = await supabase.auth.signInWithOtp({ email });
			if (error) throw error;
			return toastStore.trigger({
				...t,
				message: 'Check your email for the login link!',
				preset: 'success'
			});
		} catch (error) {
			if (error instanceof Error) {
				return toastStore.trigger({ ...t, message: error.message });
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex h-full justify-center items-center">
	<section
		class="rounded-container-token container max-w-[600px] mx-auto px-4 py-10 md:py-20 space-y-20"
	>
		<div class="card p-4 items-center h-full">
			<div class="text-center p-4">
				<h1><span class="gradient-heading">Sign in</span></h1>
				<p class="mt-4"><small>Send a magic link to your email</small></p>
			</div>
			<!-- Card Body -->
			<form use:focusTrap={true} on:submit|preventDefault={handleLogin}>
				<div class="p-4 grid grid-cols-1 gap-4">
					<div class="space-y-4">
						<label class="label">
							<span>Email</span>
							<input
								class="input"
								type="email"
								placeholder="john@example.com"
								autocomplete="email"
								required
								bind:value={email}
							/>
						</label>
					</div>
					<div class="mt-4">
						<div class="flex justify-start float-left content-center">
							<a class="btn variant-ringed-primary" href="/signup">
								<span>Sign up</span>
							</a>
						</div>
						<div class="float-right">
							{#if loading}
								<div class="flex justify-end mr-20">
									<div class="w-8">
										<ProgressRadial
											stroke={150}
											meter="stroke-primary-500"
											track="stroke-primary-500/30"
										/>
									</div>
								</div>
							{:else}
								<button type="submit" class="btn variant-filled-primary">
									<span>Send magic link</span>
								</button>
							{/if}
						</div>
					</div>
				</div>
			</form>
		</div>
	</section>
</div>
