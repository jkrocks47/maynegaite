<script lang="ts">
	import HUDOverlay from '$lib/components/astronomy/HUDOverlay.svelte';
	import ScrollReveal from '$lib/components/astronomy/ScrollReveal.svelte';
	import { browser } from '$app/environment';

	interface GalleryImage {
		id: string;
		url: string;
		caption: string | null;
		photographer: string | null;
		width?: number | null;
		height?: number | null;
	}

	interface Props {
		images: GalleryImage[];
	}

	let { images }: Props = $props();

	let scrollContainer: HTMLDivElement | undefined = $state();

	function pseudoRandomCoord(id: string) {
		let hash = 0;
		for (let i = 0; i < id.length; i++) {
			hash = (hash << 5) - hash + id.charCodeAt(i);
			hash |= 0;
		}
		const ra_h = Math.abs(hash % 24);
		const ra_m = Math.abs((hash >> 4) % 60);
		const dec_d = (Math.abs((hash >> 8) % 180)) - 90;
		const dec_m = Math.abs((hash >> 12) % 60);
		const sign = dec_d >= 0 ? '+' : '';
		return `RA ${ra_h}h ${ra_m}m, Dec ${sign}${dec_d}\u00B0 ${dec_m}'`;
	}

	function pseudoExposure(id: string) {
		let hash = 0;
		for (let i = 0; i < id.length; i++) {
			hash = (hash << 3) - hash + id.charCodeAt(i);
			hash |= 0;
		}
		const minutes = Math.abs(hash % 30) + 5;
		const seconds = Math.abs((hash >> 5) % 60);
		return `${minutes}m ${seconds}s`;
	}

	function scrollBy(direction: number) {
		if (!scrollContainer) return;
		scrollContainer.scrollBy({ left: direction * 340, behavior: 'smooth' });
	}
</script>

<section class="relative bg-cosmos-black py-20 px-4">
	<div class="max-w-7xl mx-auto">
		<!-- Section title — left-aligned, brutalist with HUD bracket accent -->
		<div class="mb-10 relative">
			<h2 class="font-display font-bold text-astro-cream text-2xl md:text-3xl uppercase tracking-[0.12em] relative inline-block">
				<span class="absolute -left-4 top-0 w-3 h-3 border-l border-t border-astro-cream/15"></span>
				Deep Field Gallery
			</h2>
			<div class="mt-3 h-px w-20 bg-astro-cream/15"></div>
		</div>

		{#if images.length === 0}
			<!-- Placeholder: square polaroid snapshots -->
			<div class="relative">
				<div class="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide py-4" bind:this={scrollContainer}>
					{#each Array(4) as _, i}
						<ScrollReveal delay={i * 80}>
							<div
								class="flex-shrink-0 w-72 md:w-80 snap-center deep-field-frame"
							>
								<div
									class="w-full aspect-square flex items-center justify-center"
									style="background: linear-gradient({30 + i * 25}deg, rgba(232,93,38,0.15), rgba(168,85,247,0.1), rgba(10,10,15,0.9));"
								>
									<span class="font-mono text-[10px] text-white/20 tracking-wider uppercase text-center px-4">
										Gallery images coming soon
									</span>
								</div>
							</div>
						</ScrollReveal>
					{/each}
				</div>
			</div>
		{:else}
			<!-- Square polaroid snapshots of the infinite -->
			<div class="relative">
				<!-- Scroll arrows -->
				<button
					class="absolute left-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-r from-cosmos-black/80 to-transparent hidden md:flex items-center justify-start pl-2 text-astro-cream/40 hover:text-astro-cream transition-colors"
					onclick={() => scrollBy(-1)}
					aria-label="Scroll left"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M13 4L7 10L13 16" />
					</svg>
				</button>
				<button
					class="absolute right-0 top-0 bottom-0 z-20 w-16 bg-gradient-to-l from-cosmos-black/80 to-transparent hidden md:flex items-center justify-end pr-2 text-astro-cream/40 hover:text-astro-cream transition-colors"
					onclick={() => scrollBy(1)}
					aria-label="Scroll right"
				>
					<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
						<path d="M7 4L13 10L7 16" />
					</svg>
				</button>

				<div class="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide py-4" bind:this={scrollContainer}>
					{#each images as image, i}
						<ScrollReveal delay={i * 60}>
							<div class="relative group flex-shrink-0 w-72 md:w-80 snap-center">
								{#if i === 0}
									<!-- Featured image: permanent monospaced data block overlay -->
									<div class="relative overflow-hidden deep-field-frame">
										<img
											src={image.url}
											alt={image.caption || 'Deep field photograph'}
											class="w-full aspect-square object-cover deep-field-img"
											loading="lazy"
										/>

										<!-- Stark monospaced data block — transforms beauty into scientific evidence -->
										<div class="absolute bottom-0 left-0 right-0 bg-black/60 p-3 pointer-events-none">
											<div class="space-y-1">
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">COORDINATES</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">{pseudoRandomCoord(image.id)}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">EXPOSURE</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">{pseudoExposure(image.id)}</span>
												</div>
												<div class="flex items-center justify-between">
													<span class="font-mono text-[9px] tracking-[0.15em] uppercase text-green-400/50">SENSOR</span>
													<span class="font-mono text-[10px] text-[#22ff88]/80">ISO 3200 / f2.8</span>
												</div>
											</div>
										</div>

										<!-- Corner brackets -->
										<div class="absolute top-2 left-2 w-4 h-4 border-l border-t border-white/20"></div>
										<div class="absolute top-2 right-2 w-4 h-4 border-r border-t border-white/20"></div>
										<div class="absolute bottom-[76px] left-2 w-4 h-4 border-l border-b border-white/20"></div>
										<div class="absolute bottom-[76px] right-2 w-4 h-4 border-r border-b border-white/20"></div>
									</div>
								{:else}
									<!-- Standard deep field window -->
									<div class="relative overflow-hidden deep-field-frame">
										<img
											src={image.url}
											alt={image.caption || 'Deep field photograph'}
											class="w-full aspect-square object-cover deep-field-img transition-transform duration-500 ease-out group-hover:scale-105"
											loading="lazy"
										/>

										<!-- HUD overlay on hover -->
										<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-in-out">
											<HUDOverlay
												coordinate={pseudoRandomCoord(image.id)}
												exposureTime={pseudoExposure(image.id)}
												equipment="CELESTRON C8"
												date={image.photographer || 'Unknown'}
											/>
										</div>
									</div>
								{/if}
							</div>
						</ScrollReveal>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	/* Square polaroid frames — windows into the infinite */
	.deep-field-frame {
		border: 2px solid rgba(255,255,255,0.06);
		transition: border-color 0.4s ease, box-shadow 0.4s ease;
	}

	.deep-field-frame:hover {
		border-color: rgba(232, 93, 38, 0.4);
		box-shadow:
			0 0 20px rgba(232, 93, 38, 0.25),
			0 0 40px rgba(232, 93, 38, 0.08);
	}

	/* Full vivid color — burning ambers, searing magentas, cold bright pinpricks */
	.deep-field-img {
		filter: contrast(1.15) saturate(1.2);
	}

	/* Scrollbar hiding */
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.deep-field-img {
			transition: none;
		}

		.deep-field-frame {
			transition: none;
		}
	}
</style>
