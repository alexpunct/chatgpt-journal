<!-- Layout: (root) -->
<script lang="ts">
	// SvelteKit Imports
	import { supabase } from '$lib/supabaseClient';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { dev } from '$app/environment';

	import GoogleAnalytics from '@sajuthankappan/sveltekit-google-analytics';
	const gaKey = import.meta.env.VITE_GA_KEY;

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	// Stores
	import { storeCurrentUrl } from '$lib/stores';

	// Components & Utilities
	import { AppShell, Modal, Toast, ProgressBar } from '@skeletonlabs/skeleton';

	// Local Components
	import AppBarMinimal from '$libSkeleton/AppBar/AppBarMinimal.svelte';
	import AppBar from '$libSkeleton/AppBar/AppBar.svelte';
	import Sidebar from '$libSkeleton/Navigation/Sidebar.svelte';
	import Drawer from '$libSkeleton/Navigation/DocsDrawer.svelte';
	import Footer from '$libSkeleton/Footer/DocsFooter.svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange(() => {
			invalidate('supabase:auth');
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	// Skeleton Stylesheets
	import '$lib/themes/theme-chatjournal.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';

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
		title: 'Chat Journal - Express, Understand and Connect with AI',
		description:
			'Chat Journal is a web app that combines journaling and chatting with AI. It helps you express, understand yourself and connect with yourself.  Chat Journal  is not just a diary. It is your personal AI coach that you can access from any device, anywhere, anytime.',
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
</svelte:head>

{#if !dev && gaKey}
	<GoogleAnalytics {page} key={gaKey} />
{/if}

<!-- Overlays -->
<Modal />
<Toast />
<Drawer />

{#if $navigating}
	<div class="absolute w-[100%] top-0 z-50">
		<ProgressBar
			value={undefined}
			height="h-0.5"
			meter="bg-primary-500"
			track="bg-primary-500/30"
		/>
	</div>
{/if}

<!-- App Shell -->
<AppShell {slotSidebarLeft} slotFooter="bg-black p-4">
	<!-- Header -->
	<svelte:fragment slot="pageHeader">
		{#if $page.data.session}
			<AppBar />
		{:else}
			<AppBarMinimal />
		{/if}
	</svelte:fragment>

	<!-- Sidebar (Left) -->
	<svelte:fragment slot="sidebarLeft">
		{#if $page.data.session}
			<Sidebar class="hidden lg:grid overflow-hidden" />
		{/if}
	</svelte:fragment>
	<!-- Page Content -->
	<slot />

	<!-- Page Footer -->
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
