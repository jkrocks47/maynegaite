<script lang="ts">
	interface Props {
		clubInfo?: { contactEmail?: string | null; socialLinks?: Record<string, string> | null } | null;
		content?: Record<string, string>;
	}

	let { clubInfo = null, content = {} }: Props = $props();

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
				{content['org-name'] ?? 'UIC ASTRONOMY CLUB'} <span class="text-white/[0.08]">/</span>
				{content['coordinates'] ?? '41.8708° N, 87.6505° W'} <span class="text-white/[0.08]">/</span>
				{content['address'] ?? 'CHICAGO, IL 60607'} <span class="text-white/[0.08]">/</span>
				{content['building'] ?? 'SCI & ENG OFFICES (SEO)'} <span class="text-white/[0.08]">/</span>
				CONTACT: {(clubInfo?.contactEmail ?? 'ASTRO@UIC.EDU').toUpperCase()}
			</p>
		</div>

		<!-- Classification line -->
		<div class="mb-6 flex items-center gap-4">
			<div class="h-px flex-1 bg-white/[0.04]"></div>
			<span class="font-mono text-[8px] tracking-[0.4em] uppercase text-astro-cream/15">{content['doc-ref'] ?? 'DOCUMENT REF: SPS-UIC-2024-001 // UNRESTRICTED'}</span>
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
				<span class="font-mono text-[7px] tracking-[0.35em] text-astro-cream/10 uppercase">{content['barcode-label'] ?? 'ADMIT ONE // ROOFTOP OBSERVATORY ACCESS'}</span>
			</div>

			<!-- Social Links — stripped, utilitarian -->
			<div class="flex items-center gap-6">
				{#if clubInfo?.socialLinks && Object.keys(clubInfo.socialLinks).length > 0}
					{#each Object.entries(clubInfo.socialLinks) as [platform, url]}
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							class="flex items-center gap-2 text-astro-cream/25 hover:text-astro-cream/50 transition-colors no-underline"
						>
							<span class="font-mono text-[9px] tracking-[0.15em] uppercase">{platform}</span>
						</a>
					{/each}
				{:else}
					<a
						href="https://facebook.com"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-astro-cream/25 hover:text-astro-cream/50 transition-colors no-underline"
					>
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase">FB</span>
					</a>
					<a
						href="https://twitter.com"
						target="_blank"
						rel="noopener noreferrer"
						class="flex items-center gap-2 text-astro-cream/25 hover:text-astro-cream/50 transition-colors no-underline"
					>
						<span class="font-mono text-[9px] tracking-[0.15em] uppercase">TW</span>
					</a>
				{/if}
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
