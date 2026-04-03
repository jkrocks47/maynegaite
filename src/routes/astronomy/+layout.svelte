<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import StarField from '$lib/components/astronomy/StarField.svelte';
	import FilmGrain from '$lib/components/astronomy/FilmGrain.svelte';
	import AstronomyNav from '$lib/components/astronomy/AstronomyNav.svelte';
	import AstronomyFooter from '$lib/components/astronomy/AstronomyFooter.svelte';
	import MouseParallax from '$lib/components/astronomy/MouseParallax.svelte';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { data, children }: Props = $props();
</script>

<div class="astronomy-theme astro-cursor bg-[#0a0a0f] text-[#f5f0e8] min-h-screen relative">
	<StarField />
	<AstronomyNav />

	<MouseParallax>
		<main class="relative z-10 pt-20">
			{@render children()}
		</main>
	</MouseParallax>

	<AstronomyFooter clubInfo={data.clubInfo} content={data.footerContent} />
	<FilmGrain />
</div>
