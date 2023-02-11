<!-- Layout: (root) -->
<script lang="ts">
	import { inject } from '@vercel/analytics';
	import hljs from 'highlight.js';
	import '$libSkeleton/Styles/highlight-js.css'; // was: 'highlight.js/styles/github-dark.css';
	import { storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);

	// SvelteKit Imports
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	// Stores
	import { storeCurrentUrl, storeTheme } from '$lib/stores';
	import { storePreview } from '$libSkeleton/Themer/stores';

	// Components & Utilities
	import { AppShell, Modal, Toast } from '@skeletonlabs/skeleton';

	// Local Components
	import AppBarMinimal from '$libSkeleton/AppBar/AppBarMinimal.svelte';
	import AppBar from '$libSkeleton/AppBar/AppBar.svelte';
	import Sidebar from '$libSkeleton/Navigation/DocsSidebar.svelte';
	import Drawer from '$libSkeleton/Navigation/DocsDrawer.svelte';
	import Footer from '$libSkeleton/Footer/DocsFooter.svelte';

	// Skeleton Stylesheets
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

	// Theme stylesheet is loaded from LayoutServerData
	import type { LayoutServerData } from './$types';
	export let data: LayoutServerData;

	if (data.vercelEnv == 'production') {
		inject();
	}

	$: ({ currentTheme } = data);

	// Set body `data-theme` based on current theme status
	storeTheme.subscribe(setBodyThemeAttribute);
	storePreview.subscribe(setBodyThemeAttribute);
	function setBodyThemeAttribute(): void {
		if (!browser) return;
		document.body.setAttribute('data-theme', $storePreview ? 'generator' : $storeTheme);
	}

	afterNavigate((params: any) => {
		// Store current page route URL
		storeCurrentUrl.set($page.url.pathname);
		// Scroll to top
		const isNewPage: boolean =
			params.from && params.to && params.from.route.id !== params.to.route.id;
		const elemPage = document.querySelector('#page');
		if (isNewPage && elemPage !== null) {
			elemPage.scrollTop = 0;
		}
	});

	function matchPathWhitelist(pageUrlPath: string): boolean {
		// If homepage route
		if (pageUrlPath === '/') return true;
		return false;
	}

	// SEO Metatags
	const metaDefaults = {
		title: 'Chat Journal - The Best Journaling App (Powered by GPT-3)',
		description:
			'Chat Journal is the best journaling app. It uses GPT-3 to help you undertake a daily journaling practice and improve your mental health.',
		image: 'chatjournal-logo-no-bg-tiny.png'
	};
	const meta = {
		title: metaDefaults.title,
		description: metaDefaults.description,
		image: metaDefaults.image,
		// Article
		article: { publishTime: '', modifiedTime: '', author: '' },
		// Twitter
		twitter: {
			title: metaDefaults.title,
			description: metaDefaults.description,
			image: metaDefaults.image
		}
	};
	let isBlogArticle = false;

	// Monitor $page for changes
	page.subscribe((page) => {
		// Restore Page Defaults
		meta.title = metaDefaults.title;
		meta.description = metaDefaults.description;
		meta.image = metaDefaults.image;
		// Restore Twitter Defaults
		meta.twitter.title = metaDefaults.title;
		meta.twitter.description = metaDefaults.description;
		meta.twitter.image = metaDefaults.image;
	});

	// Disable left sidebar on homepage
	$: slotSidebarLeft = matchPathWhitelist($page.url.pathname)
		? 'w-0'
		: 'bg-surface-50-900-token lg:w-auto';
</script>

<svelte:head>
	<title>{meta.title}</title>
	<!-- Meta Tags -->
	<meta name="title" content={meta.title} />
	<meta name="description" content={meta.description} />
	<meta name="keywords" content="journal, chat, gpt-3, ai, diary, chatgpt, bard, bing, openai" />
	<meta name="theme-color" content="#242c46" />
	<meta name="author" content="Alex Bejan" />
	<meta property="og:site_name" content="Chat Journal" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.chatjournal.ai{$page.url.pathname}" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:title" content={meta.title} />
	<meta property="og:description" content={meta.description} />
	<meta property="og:image" content={meta.image} />
	<meta property="og:image:secure_url" content={meta.image} />
	<meta property="og:image:type" content="image/jpg" />
	<meta property="og:image:width" content="1707" />
	<meta property="og:image:height" content="1233" />
	<!-- Open Graph: Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@ChatJournalAi" />
	<meta name="twitter:creator" content="@ChatJournalAi" />
	<meta name="twitter:title" content={meta.twitter.title} />
	<meta name="twitter:description" content={meta.twitter.description} />
	<meta name="twitter:image" content={meta.twitter.image} />

	<!-- Select Preset Theme CSS DO NOT REMOVE ESCAPES-->
	{@html `\<style\>${currentTheme}}\</style\>`}
</svelte:head>

<!-- Overlays -->
<Modal />
<Toast />
<Drawer />

<!-- App Shell -->
<AppShell {slotSidebarLeft} slotFooter="bg-black p-4">
	<!-- Header -->
	<svelte:fragment slot="header">
		{#if $page.data.session}
			<AppBar />
		{:else}
			<AppBarMinimal />
		{/if}
	</svelte:fragment>

	<!-- Sidebar (Left) -->
	<svelte:fragment slot="sidebarLeft">
		{#if $page.data.session}
			<Sidebar class="hidden lg:grid w-[360px] overflow-hidden" />
		{/if}
	</svelte:fragment>

	<!-- Page Content -->
	<slot />

	<!-- Page Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
