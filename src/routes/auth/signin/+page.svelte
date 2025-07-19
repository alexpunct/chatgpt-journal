<script lang="ts">
	// Utilities
	import { errorToast } from '$lib/helpers/triggerToast';
	import { supabase } from '$lib/supabaseClient';

	// Components
	import { focusTrap } from '@skeletonlabs/skeleton';

	/** @type {import('./$types').ActionData} */
	export let form;

	if (form?.error) {
		errorToast(form.error);
	}

	async function handleGoogleSignup(event: Event) {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		});
		if (error) {
			errorToast(error.message);
		}
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
				<div class="float-right">
					<button type="submit" class="btn variant-filled-primary card-hover shadow">
						<span>Submit</span>
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
