<script lang="ts">
	import type { MemberUser } from '$lib/server/auth';

	let { member = null }: { member?: MemberUser | null } = $props();

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/about', label: 'About' },
		{ href: '/events', label: 'Events' },
		{ href: '/board', label: 'Board' },
		{ href: '/gallery', label: 'Gallery' },
		{ href: '/documents', label: 'Documents' },
		{ href: '/contact', label: 'Contact' }
	];

	$effect(() => {
		function onScroll() {
			scrolled = window.scrollY > 10;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<nav
	class="sticky top-0 z-50 transition-shadow duration-300 bg-white border-b border-mg-stone
		{scrolled ? 'shadow-md' : ''}"
>
	<div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
		<!-- Wordmark -->
		<a href="/" class="no-underline flex items-center" aria-label="Maynegaite home">
			<img
				src="/logo.webp"
				alt="Maynegaite of Olympia Fields"
				class="h-11 w-auto"
			/>
		</a>

		<!-- Desktop links -->
		<div class="hidden md:flex items-center gap-6">
			{#each links as link}
				<a href={link.href} class="font-ui text-sm text-mg-charcoal hover:text-mg-forest transition-colors no-underline">
					{link.label}
				</a>
			{/each}
		</div>

		<!-- Auth link -->
		<div class="hidden md:block">
			{#if member}
				<a href="/dashboard" class="btn-primary text-sm">Dashboard</a>
			{:else}
				<a href="/login" class="btn-secondary text-sm">Sign In</a>
			{/if}
		</div>

		<!-- Mobile hamburger -->
		<button
			class="md:hidden p-2 text-mg-charcoal"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-label="Toggle menu"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if mobileOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="md:hidden border-t border-mg-stone bg-white px-4 pb-4 pt-2">
			{#each links as link}
				<a
					href={link.href}
					class="block py-2 font-ui text-sm text-mg-charcoal hover:text-mg-forest no-underline"
					onclick={() => (mobileOpen = false)}
				>
					{link.label}
				</a>
			{/each}
			<div class="pt-3 border-t border-mg-stone mt-2">
				{#if member}
					<a href="/dashboard" class="btn-primary text-sm w-full text-center">Dashboard</a>
				{:else}
					<a href="/login" class="btn-secondary text-sm w-full text-center">Sign In</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
