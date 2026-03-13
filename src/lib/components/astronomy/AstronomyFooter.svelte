<script lang="ts">
	// Barcode pattern: dense, archival scanning barcode
	const bars = Array.from({ length: 80 }, (_, i) => ({
		x: i * 3.5,
		width: Math.random() > 0.6 ? 2.5 : Math.random() > 0.3 ? 1.5 : 1,
		opacity: 0.25 + Math.random() * 0.5
	}));
</script>

<footer class="relative bg-[#060810] border-t border-white/[0.04] pt-12 pb-8 overflow-hidden">
	<!-- Concentric circles SVG background — filed, categorized -->
	<svg
		class="absolute pointer-events-none concentric-circles"
		width="500"
		height="500"
		viewBox="0 0 500 500"
		aria-hidden="true"
		style="right: -12%; top: 50%; transform: translateY(-50%);"
	>
		<g class="concentric-group">
			{#each [230, 195, 160, 125, 90, 55] as r}
				<circle
					cx="250"
					cy="250"
					{r}
					fill="none"
					stroke="rgba(34, 211, 238, 0.04)"
					stroke-width="0.5"
				/>
			{/each}
		</g>
	</svg>

	<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Industrial info line: physical coordinates, utilitarian data -->
		<div class="mb-6">
			<p class="font-mono text-[10px] tracking-[0.25em] uppercase text-astro-cream/35 leading-relaxed">
				UIC ASTRONOMY CLUB <span class="text-white/[0.08]">/</span>
				41.8708&deg; N, 87.6505&deg; W <span class="text-white/[0.08]">/</span>
				CHICAGO, IL 60607 <span class="text-white/[0.08]">/</span>
				SCI &amp; ENG OFFICES (SEO) <span class="text-white/[0.08]">/</span>
				CONTACT: ASTRO@UIC.EDU
			</p>
		</div>

		<!-- Classification line -->
		<div class="mb-6 flex items-center gap-4">
			<div class="h-px flex-1 bg-white/[0.04]"></div>
			<span class="font-mono text-[8px] tracking-[0.4em] uppercase text-astro-cream/15">DOCUMENT REF: SPS-UIC-2024-001 // UNRESTRICTED</span>
			<div class="h-px flex-1 bg-white/[0.04]"></div>
		</div>

		<!-- Bottom Row: Barcode + Social -->
		<div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
			<!-- Large scanning barcode — archival weight -->
			<div class="flex flex-col items-start gap-1.5">
				<svg
					width="280"
					height="28"
					viewBox="0 0 280 28"
					class="opacity-15"
					aria-hidden="true"
				>
					{#each bars as bar}
						<rect
							x={bar.x}
							y="0"
							width={bar.width}
							height="28"
							fill="#f5f0e8"
							opacity={bar.opacity}
						/>
					{/each}
				</svg>
				<span class="font-mono text-[7px] tracking-[0.35em] text-astro-cream/10 uppercase">ADMIT ONE // ROOFTOP OBSERVATORY ACCESS</span>
			</div>

			<!-- Social Links — stripped, utilitarian -->
			<div class="flex items-center gap-6">
				<a
					href="https://facebook.com"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-astro-cream/25 hover:text-astro-cream/50 transition-colors no-underline"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
					</svg>
					<span class="font-mono text-[9px] tracking-[0.15em] uppercase">FB</span>
				</a>
				<a
					href="https://twitter.com"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-astro-cream/25 hover:text-astro-cream/50 transition-colors no-underline"
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
					</svg>
					<span class="font-mono text-[9px] tracking-[0.15em] uppercase">TW</span>
				</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.concentric-group {
		transform-origin: 250px 250px;
		animation: concentric-spin 90s linear infinite;
	}

	@keyframes concentric-spin {
		to { transform: rotate(360deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.concentric-group {
			animation: none;
		}
	}
</style>
