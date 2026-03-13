<script lang="ts">
	const phases = [
		{ name: 'New Moon', illumination: 0, label: 'N' },
		{ name: 'Waxing Crescent', illumination: 0.25, label: '' },
		{ name: 'First Quarter', illumination: 0.5, label: 'FQ' },
		{ name: 'Waxing Gibbous', illumination: 0.75, label: '' },
		{ name: 'Full Moon', illumination: 1, label: 'F' },
		{ name: 'Waning Gibbous', illumination: 0.75, label: '' },
		{ name: 'Last Quarter', illumination: 0.5, label: 'LQ' },
		{ name: 'Waning Crescent', illumination: 0.25, label: '' }
	];

	const radius = 70;
	const moonRadius = 15;
</script>

<svg
	width="200"
	height="200"
	viewBox="0 0 200 200"
	class="block lunar-viz"
	aria-label="Lunar phase visualization showing 8 moon phases"
	role="img"
>
	<!-- Dotted orbit ring -->
	<circle
		cx="100"
		cy="100"
		r={radius}
		fill="none"
		stroke="rgba(255,255,255,0.08)"
		stroke-width="0.5"
		stroke-dasharray="3 4"
	/>

	<g class="lunar-orbit">
		{#each phases as phase, i}
			{@const angle = (i * Math.PI * 2) / 8 - Math.PI / 2}
			{@const cx = 100 + radius * Math.cos(angle)}
			{@const cy = 100 + radius * Math.sin(angle)}
			{@const illum = phase.illumination}
			{@const isWaning = i > 4}

			<g>
				<!-- Dark base circle -->
				<circle
					cx={cx}
					cy={cy}
					r={moonRadius}
					fill="#1a1a2e"
					stroke="rgba(255,255,255,0.1)"
					stroke-width="0.5"
				/>

				<!-- Illuminated portion -->
				{#if illum === 1}
					<!-- Full moon with outer glow -->
					<circle cx={cx} cy={cy} r={moonRadius + 3} fill="none" stroke="rgba(232,232,240,0.15)" stroke-width="0.5" />
					<circle cx={cx} cy={cy} r={moonRadius} fill="#e8e8f0" />
				{:else if illum === 0}
					<!-- New moon -->
					<circle
						cx={cx}
						cy={cy}
						r={moonRadius}
						fill="none"
						stroke="rgba(255,255,255,0.15)"
						stroke-width="0.5"
					/>
				{:else if illum === 0.5}
					<!-- Quarter -->
					<path
						d={isWaning
							? `M ${cx} ${cy - moonRadius} A ${moonRadius} ${moonRadius} 0 0 0 ${cx} ${cy + moonRadius} L ${cx} ${cy - moonRadius} Z`
							: `M ${cx} ${cy - moonRadius} A ${moonRadius} ${moonRadius} 0 0 1 ${cx} ${cy + moonRadius} L ${cx} ${cy - moonRadius} Z`}
						fill="#e8e8f0"
					/>
				{:else}
					<!-- Crescent or Gibbous -->
					{@const sweep = illum > 0.5 ? 1 : 0}
					{@const bulge = moonRadius * Math.abs(2 * illum - 1)}
					<path
						d={isWaning
							? `M ${cx} ${cy - moonRadius} A ${moonRadius} ${moonRadius} 0 0 0 ${cx} ${cy + moonRadius} A ${bulge} ${moonRadius} 0 0 ${sweep} ${cx} ${cy - moonRadius} Z`
							: `M ${cx} ${cy - moonRadius} A ${moonRadius} ${moonRadius} 0 0 1 ${cx} ${cy + moonRadius} A ${bulge} ${moonRadius} 0 0 ${sweep} ${cx} ${cy - moonRadius} Z`}
						fill="#e8e8f0"
					/>
				{/if}

				<!-- Cardinal phase labels -->
				{#if phase.label}
					{@const labelR = radius + 22}
					{@const lx = 100 + labelR * Math.cos(angle)}
					{@const ly = 100 + labelR * Math.sin(angle)}
					<text
						x={lx}
						y={ly}
						text-anchor="middle"
						dominant-baseline="middle"
						fill="rgba(255,255,255,0.2)"
						font-family="'JetBrains Mono', monospace"
						font-size="7"
						letter-spacing="0.05em"
					>
						{phase.label}
					</text>
				{/if}
			</g>
		{/each}
	</g>
</svg>

<style>
	.lunar-viz {
		filter: drop-shadow(0 0 3px rgba(232, 232, 240, 0.3));
	}

	.lunar-orbit {
		transform-origin: 100px 100px;
		animation: lunar-spin 120s linear infinite;
	}

	@keyframes lunar-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lunar-orbit {
			animation: none;
		}
	}
</style>
