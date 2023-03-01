<script lang="ts">
	// Types
	import type { ShellSettings } from '$libSkeleton/Shell/types';

	// Components
	import { TableOfContents } from '@skeletonlabs/skeleton';

	// Props
	export let settings: ShellSettings;
	// Props (styles)
	export let spacing = 'space-y-8 md:space-y-12';
	// Props (regions)
	export let regionHeader = 'variant-glass-surface border-b border-black/5 dark:border-white/5';
	export let regionPanels = 'page-container';
	export let rightColumn = 'lg:col-span-1';

	// Classes
	const cBase = '';

	// Local
	const defaultSettings: ShellSettings = {
		// Heading
		name: '(name)',
		description: '(description)',
		// Table of contents
		toc: true,
		// Docs
		components: [],
		restProps: undefined,
		parameters: [],
		classes: [],
		keyboard: []
	};
	const pageSettings: ShellSettings = { ...defaultSettings, ...settings };

	if (pageSettings.toc) {
		rightColumn = '2xl:grid-cols-[1fr_240px]';
	}

	// Sveld Counts ---
	// Conditional tab display based on Sveld reference counts

	const sveldCounts = { props: 0, slots: 0, events: 0 };

	if (pageSettings.components && pageSettings.components?.length > 0) {
		pageSettings.components.forEach((comp) => {
			sveldCounts.props += comp.sveld.props.length;
			sveldCounts.slots += comp.sveld.slots.length;
			sveldCounts.events += comp.sveld.events.length;
		});
	}

	// Reactive
	$: classesBase = `${cBase} ${$$props.class ?? ''}`;
	$: classesRegionHeader = `${regionHeader}`;
	$: classesRegionPanels = `${regionPanels}`;
</script>

<div class="doc-shell {classesBase}">
	<!-- Region: Header -->
	<!-- <header class="doc-shell-header {classesRegionHeader} p-4 md:p-0 text-center md:text-left"> -->
	<!-- Information -->
	<!-- <div class="doc-shell-info page-container lg:!space-y-10"> -->
	<!-- Intro -->
	<!-- <section class="space-y-4">
				<div class="text-center md:text-left space-x-4">
					<h1 class="gradient-heading pb-1 box-decoration-clone">
						{@html pageSettings.name}
					</h1>
				</div>
				{#if pageSettings.description}
					<p>{@html pageSettings.description}</p>
				{/if}
			</section> -->
	<!-- </div> -->
	<!-- </header> -->

	<!-- Tab Panels -->
	<div class="doc-shell-tab-panels relative">
		<div class="doc-shell-usage {classesRegionPanels}">
			<div class="grid grid-cols-1 {rightColumn}">
				<!-- Content -->
				<div class={spacing}>
					<!-- Slot: Examples Sandbox -->
					{#if $$slots.sandbox}
						<div>
							<h2 class="sr-only">Examples</h2>
							<div class="doc-shell-sandbox {spacing}">
								<slot name="sandbox">(sandbox)</slot>
							</div>
						</div>
					{/if}
					<div id="toc-target" class={spacing}>
						<!-- Slot: Usage -->
						{#if $$slots.usage}
							<div>
								<h2 class="sr-only">Getting Started</h2>
								<div class="doc-shell-usage {spacing}">
									<slot name="usage">(usage)</slot>
								</div>
							</div>
						{/if}
						<!-- Slot: Overflow -->
						{#if $$slots.default}
							<footer class="doc-shell-footer"><slot /></footer>
						{/if}
					</div>
				</div>
				{#if pageSettings.toc}
					<!-- Table of Contents -->
					<div>
						<TableOfContents
							target="#toc-target"
							minimumHeadings={1}
							class="sticky top-10 hidden 2xl:inline-block ml-4"
						/>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
</style>
