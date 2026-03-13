<script lang="ts">
	interface Props {
		coordinate?: string;
		exposureTime?: string;
		equipment?: string;
		date?: string;
	}

	let { coordinate = '', exposureTime = '', equipment = '', date = '' }: Props = $props();
</script>

<div
	class="absolute inset-0 bg-black/60 flex flex-col justify-end p-4 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
>
	<!-- Scanning line sweep -->
	<div class="hud-scan-line"></div>

	<div class="space-y-1.5">
		{#if coordinate}
			<div class="flex items-center gap-2">
				<span class="font-mono text-[10px] tracking-[0.15em] uppercase text-cyan-400/50">
					COORD
				</span>
				<span class="font-mono text-xs text-[#22d3ee]">
					{coordinate}
				</span>
			</div>
		{/if}

		{#if exposureTime}
			<div class="flex items-center gap-2">
				<span class="font-mono text-[10px] tracking-[0.15em] uppercase text-cyan-400/50">
					EXP
				</span>
				<span class="font-mono text-xs text-[#22d3ee]">
					{exposureTime}
				</span>
			</div>
		{/if}

		{#if equipment}
			<div class="flex items-center gap-2">
				<span class="font-mono text-[10px] tracking-[0.15em] uppercase text-cyan-400/50">
					EQUIP
				</span>
				<span class="font-mono text-xs text-[#22d3ee]">
					{equipment}
				</span>
			</div>
		{/if}

		{#if date}
			<div class="flex items-center gap-2">
				<span class="font-mono text-[10px] tracking-[0.15em] uppercase text-cyan-400/50">
					DATE
				</span>
				<span class="font-mono text-xs text-[#22d3ee]">
					{date}
				</span>
			</div>
		{/if}
	</div>

	<!-- HUD corner decorations (larger with glow) -->
	<div class="absolute top-2 left-2 w-5 h-5 border-l border-t border-[#22d3ee]/40 hud-corner-glow"></div>
	<div class="absolute top-2 right-2 w-5 h-5 border-r border-t border-[#22d3ee]/40 hud-corner-glow"></div>
	<div class="absolute bottom-2 left-2 w-5 h-5 border-l border-b border-[#22d3ee]/40 hud-corner-glow"></div>
	<div class="absolute bottom-2 right-2 w-5 h-5 border-r border-b border-[#22d3ee]/40 hud-corner-glow"></div>

	<!-- Recording indicator -->
	<div class="absolute top-3 right-8 flex items-center gap-1.5">
		<span class="rec-dot w-1.5 h-1.5 rounded-full bg-green-500"></span>
		<span class="font-mono text-[8px] text-green-400/60 tracking-wider">REC</span>
	</div>
</div>

<style>
	.hud-scan-line {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.3) 50%, transparent 100%);
		animation: hud-scan-sweep 4s linear infinite;
		pointer-events: none;
	}

	@keyframes hud-scan-sweep {
		0% { top: 0; opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { top: 100%; opacity: 0; }
	}

	.hud-corner-glow {
		box-shadow: 0 0 4px rgba(34, 211, 238, 0.15);
	}

	.rec-dot {
		animation: rec-blink 2s ease-in-out infinite;
	}

	@keyframes rec-blink {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.2; }
	}

	@media (prefers-reduced-motion: reduce) {
		.hud-scan-line {
			animation: none;
			display: none;
		}

		.rec-dot {
			animation: none;
		}
	}
</style>
