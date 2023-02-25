<script lang="ts">
	// Utilities
	import { errorToast } from '$lib/helpers/triggerToast';

	// Components
	import { focusTrap } from '@skeletonlabs/skeleton';

	/** @type {import('./$types').ActionData} */
	export let form;

	if (form?.error) {
		errorToast(form.error);
	}
</script>

<div class="card p-4 items-center h-full max-w-[600px] m-auto">
	<!-- Card Header -->
	<div class="text-center p-4">
		<h1><span class="gradient-heading">Sign up</span></h1>
		<!-- <p class="mt-4"><small>Send a magic link to your email</small></p> -->
	</div>
	<!-- Card Body -->
	<form method="POST" use:focusTrap={true}>
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
					<button type="submit" class="btn variant-filled-primary card-hover shadow pl-5 pr-5">
						<span>Submit</span>
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
