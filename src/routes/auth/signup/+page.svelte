<script lang="ts">
	// Utilities
	import { errorToast, successToast } from '$lib/helpers/triggerToast';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { applyAction, deserialize } from '$app/forms';
	import { supabase } from '$lib/supabaseClient';

	// Components
	import { focusTrap, ProgressRadial } from '@skeletonlabs/skeleton';

	/** @type {import('./$types').ActionData} */
	export let form;
	let loading = false;

	const success = () => {
		successToast(
			'Your account has been created. Please verify your email address to login. The sender is supabase.io, so please check your junk folder too.',
			{ autohide: false }
		);
	};

	if (form?.error) {
		errorToast(form.error, { timeout: 5000 });
	}
	if (form?.success) {
		success();
	}

	async function handleGoogleSignup(event: Event) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google'
		});
		if (error) {
			errorToast(error.message);
		}
	}
</script>

<div class="card p-4 items-center h-full max-w-[600px] m-auto">
	<!-- Card Header -->
	<div class="text-center p-4">
		<h1><span class="gradient-heading">Sign up</span></h1>
		<!-- <p class="mt-4"><small>Send a magic link to your email</small></p> -->
	</div>
	<!-- Card Body -->
	<form
		method="POST"
		use:focusTrap={true}
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				if (result.status === 200) {
					success();
				} else {
					errorToast(`Unexpected error, please try again later...`);
				}
				loading = false;
			};
		}}
	>
		<div class="p-4 grid grid-cols-1 gap-4">
			<div class="space-y-4">
				<label class="label">
					<span>Email</span>
					<input
						class="input"
						type="email"
						name="email"
						placeholder="john@example.com"
						autocomplete="email"
						required
					/>
				</label>
			</div>
			<div class="space-y-4">
				<label class="label">
					<span>Password</span>
					<input
						class="input"
						type="password"
						name="password"
						autocomplete="password"
						required
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
						<div class="flex justify-center p-1 pb-1.5 pr-5">
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
			<!-- <div class="mt-4">
				<hr />
			</div>
			<div class="mt-4 text-center mx-auto">
				<button class="btn" on:click|preventDefault={handleGoogleSignup}>
					<svg aria-hidden="true" class="float-left mr-2" width="18" height="18" viewBox="0 0 18 18"
						><path
							fill="#4285F4"
							d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"
						/><path
							fill="#34A853"
							d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"
						/><path
							fill="#FBBC05"
							d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"
						/><path
							fill="#EA4335"
							d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z"
						/></svg
					> Sign up with Google
				</button>
			</div> -->
		</div>
	</form>
</div>
