<script lang="ts">
	import { supabase } from '$lib/supabaseClient';
	import { ProgressRadial, focusTrap, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	let loading = false;
	let email: string;
	let password: string;

	const t: ToastSettings = {
		message: '',
		preset: 'error',
		autohide: true,
		timeout: 5000
	};

	const handleSignup = async ({ target }: Event) => {
		toastStore.clear();
		if (!email || !password) {
			return toastStore.trigger({ ...t, message: 'Please enter your credentials.' });
		}
		try {
			loading = true;
			const { data, error } = await supabase.auth.signUp({ email, password });
			if (error) throw error;
			email = '';
			password = '';
			return toastStore.trigger({
				...t,
				message: 'Check your email and click to confirm your account!',
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

<div class="card p-4 items-center h-full max-w-[600px] m-auto">
	<!-- Card Header -->
	<div class="text-center p-4">
		<h1><span class="gradient-heading">Sign up</span></h1>
		<!-- <p class="mt-4"><small>Send a magic link to your email</small></p> -->
	</div>
	<!-- Card Body -->
	<form use:focusTrap={true} on:submit|preventDefault={handleSignup}>
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
			<div class="space-y-4">
				<label class="label">
					<span>Password</span>
					<input
						class="input"
						type="password"
						autocomplete="password"
						required
						bind:value={password}
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).&#123;8,}"
						title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
					/>
					<small>8 or more characters (uppercase, lowercase letters and numbers)</small>
				</label>
			</div>
			<div class="mt-4">
				<div class="flex justify-start float-left content-center">
					<a class="btn variant-ringed-primary" href="/auth/signin">
						<span>Sign in instead</span>
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
						<button type="submit" class="btn variant-filled-primary card-hover shadow pl-5 pr-5">
							<span>Submit</span>
						</button>
					{/if}
				</div>
			</div>
		</div>
	</form>
</div>
