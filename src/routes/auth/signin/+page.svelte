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
		<h1><span class="gradient-heading">Sign in</span></h1>
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
					<input class="input" type="password" name="password" autocomplete="password" required />
				</label>
			</div>
			<div class="mt-4">
				<div class="flex justify-start float-left content-center">
					<a class="btn variant-ringed-primary" href="/auth/signup">
						<span>Sign up</span>
					</a>
				</div>
				<div class="float-right">
					<button type="submit" class="btn variant-filled-primary card-hover shadow">
						<span>Submit</span>
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
