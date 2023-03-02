<script lang="ts">
	import { page } from '$app/stores';

	// Components
	import { ProgressRadial, focusTrap, Accordion, AccordionItem } from '@skeletonlabs/skeleton';

	let loading = false;
</script>

<!-- Filters -->
<div class="container space-y-8">
	<div>
		<h4 class="text-center p-4">
			<i class="fa-solid fa-filter text-lg mr-2" />
			Narrow down
		</h4>
		<div class="mt-4 list px-4">
			<form use:focusTrap={true}>
				<div class="hidden">Search</div>
				<div class="text-sm">
					<label class="label">
						<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
							<div class="input-group-shim  ">
								<i class="fa-solid fa-search hidden md:block" />
							</div>
							<input
								type="search"
								value={$page.url.searchParams.get('q')}
								name="q"
								placeholder="Search..."
							/>
							{#if loading}
								<div class="input-group-shim">
									<ProgressRadial
										stroke={100}
										meter="stroke-secondary-500"
										track="stroke-secondary-500/30"
										class="w-4 h-4"
									/>
								</div>
							{:else}
								<button class="variant-soft-secondary">Go </button>
							{/if}
						</div>
					</label>
				</div>
			</form>
		</div>
	</div>
	<div>
		<div class="list px-4 text-center">
			<a
				href="/journal/new"
				title="Create new entry"
				class="btn btn-xl btn-gradient-secondary mt-10 mx-auto"
			>
				<i class="fa-solid fa-plus mr-2" />
				New Entry
			</a>
		</div>
	</div>
</div>
