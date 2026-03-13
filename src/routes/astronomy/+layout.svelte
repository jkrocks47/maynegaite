<script lang="ts">
	import type { Snippet } from 'svelte';
	import StarField from '$lib/components/astronomy/StarField.svelte';
	import FilmGrain from '$lib/components/astronomy/FilmGrain.svelte';
	import AstronomyNav from '$lib/components/astronomy/AstronomyNav.svelte';
	import AstronomyFooter from '$lib/components/astronomy/AstronomyFooter.svelte';
	import MouseParallax from '$lib/components/astronomy/MouseParallax.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="astronomy-theme astro-cursor bg-[#0a0a0f] text-[#f5f0e8] min-h-screen relative">
	<StarField />
	<AstronomyNav />

	<MouseParallax>
		<main class="relative z-10 pt-20">
			{@render children()}
		</main>
	</MouseParallax>

	<AstronomyFooter />
	<FilmGrain />
</div>
