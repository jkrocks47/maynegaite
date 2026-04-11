<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	let { children } = $props();

	let isMobile = $state(false);
	let sidebarOpen = $state(false);
	let currentPath = $derived($page.url.pathname);
	let member = $derived($page.data.member);

	const navLinks = [
		{ href: '/dashboard', label: 'Overview' },
		{ href: '/dashboard/events', label: 'My Events' },
		{ href: '/dashboard/profile', label: 'Profile' }
	];

	$effect(() => {
		if (!browser) return;
		const mql = window.matchMedia('(max-width: 768px)');
		isMobile = mql.matches;
		if (!mql.matches) sidebarOpen = true;

		const handler = (e: MediaQueryListEvent) => {
			isMobile = e.matches;
			if (e.matches) sidebarOpen = false;
		};

		mql.addEventListener('change', handler);
		return () => mql.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = isMobile && sidebarOpen ? 'hidden' : '';
	});

	function handleNavClick() {
		if (isMobile) sidebarOpen = false;
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape' && isMobile && sidebarOpen) {
			sidebarOpen = false;
		}
	}}
/>

<div class="min-h-screen bg-mg-ivory md:flex">
	{#if isMobile && sidebarOpen}
		<button
			type="button"
			class="fixed inset-0 z-40 bg-black/30"
			onclick={() => (sidebarOpen = false)}
			aria-label="Close sidebar"
		></button>
	{/if}

	<aside
		class="fixed md:static z-50 top-0 left-0 h-screen md:h-auto w-64 bg-mg-forest text-white border-r border-mg-forestDark/30 transform transition-transform duration-200 md:translate-x-0"
		class:-translate-x-full={!sidebarOpen}
	>
		<div class="p-5 border-b border-white/10">
			<a href="/" class="block no-underline" onclick={handleNavClick}>
				<p class="font-display text-2xl font-bold text-white">Maynegaite</p>
				<p class="text-xs tracking-[0.18em] uppercase text-white/60 mt-1">Owner Portal</p>
			</a>
		</div>

			<nav class="py-3">
				{#each navLinks as link}
					<a
						href={link.href}
						class={`block px-5 py-3 text-sm no-underline transition-colors ${
							currentPath === link.href
								? 'text-mg-gold bg-white/5'
								: 'text-white/75 hover:text-white'
						}`}
						onclick={handleNavClick}
					>
						{link.label}
					</a>
			{/each}
		</nav>
	</aside>

	<div class="flex-1 min-w-0 md:ml-0">
		<header class="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-mg-stone px-4 md:px-6 py-3 flex items-center justify-between">
			<button
				type="button"
				class="md:hidden border border-mg-stone rounded px-3 py-1 text-mg-charcoal"
				onclick={() => (sidebarOpen = !sidebarOpen)}
				aria-label="Toggle navigation"
			>
				&#9776;
			</button>
			<div class="hidden md:block text-sm text-mg-warmGray">Maynegaite Homeowner Dashboard</div>
			<div class="flex items-center gap-3">
				<div class="text-right">
					<p class="text-sm font-medium text-mg-charcoal">{member.displayName}</p>
					{#if member.section}
						<p class="text-xs text-mg-warmGray capitalize">{member.section}</p>
					{/if}
				</div>
				<form method="POST" action="/api/member/logout">
					<button type="submit" class="btn-secondary text-xs">Logout</button>
				</form>
			</div>
		</header>

		<main class="p-4 md:p-6">
			{@render children()}
		</main>
	</div>
</div>
