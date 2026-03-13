<script lang="ts">
	interface Props {
		variant?: 'dark' | 'subtle';
	}

	let { variant = 'dark' }: Props = $props();

	const blobs = [
		{
			color: 'rgba(79, 70, 229, 0.55)',
			size: '50%',
			top: '15%',
			left: '10%',
			driftDelay: '0s',
			morphDelay: '0s',
			driftDuration: '28s',
			morphDuration: '22s'
		},
		{
			color: 'rgba(168, 85, 247, 0.45)',
			size: '45%',
			top: '35%',
			left: '50%',
			driftDelay: '-8s',
			morphDelay: '-5s',
			driftDuration: '32s',
			morphDuration: '18s'
		},
		{
			color: 'rgba(34, 211, 238, 0.3)',
			size: '38%',
			top: '8%',
			left: '55%',
			driftDelay: '-15s',
			morphDelay: '-10s',
			driftDuration: '35s',
			morphDuration: '25s'
		},
		{
			color: 'rgba(100, 60, 200, 0.4)',
			size: '55%',
			top: '45%',
			left: '20%',
			driftDelay: '-20s',
			morphDelay: '-15s',
			driftDuration: '30s',
			morphDuration: '20s'
		},
		{
			color: 'rgba(200, 100, 50, 0.3)',
			size: '35%',
			top: '5%',
			left: '30%',
			driftDelay: '-12s',
			morphDelay: '-8s',
			driftDuration: '38s',
			morphDuration: '24s'
		},
		{
			color: 'rgba(249, 115, 22, 0.3)',
			size: '42%',
			top: '25%',
			left: '0%',
			driftDelay: '-6s',
			morphDelay: '-3s',
			driftDuration: '34s',
			morphDuration: '26s'
		},
		{
			color: 'rgba(251, 191, 36, 0.2)',
			size: '36%',
			top: '55%',
			left: '60%',
			driftDelay: '-18s',
			morphDelay: '-12s',
			driftDuration: '36s',
			morphDuration: '28s'
		},
		{
			color: 'rgba(236, 72, 153, 0.3)',
			size: '48%',
			top: '10%',
			left: '35%',
			driftDelay: '-10s',
			morphDelay: '-7s',
			driftDuration: '30s',
			morphDuration: '22s'
		}
	];

	const opacityMult = variant === 'subtle' ? 0.5 : 1;
</script>

<div class="nebula-container" style="contain: strict;" aria-hidden="true">
	{#each blobs as blob}
		<div
			class="nebula-blob"
			style="
				background: {blob.color};
				width: {blob.size};
				padding-bottom: {blob.size};
				top: {blob.top};
				left: {blob.left};
				animation-delay: {blob.driftDelay}, {blob.morphDelay};
				animation-duration: {blob.driftDuration}, {blob.morphDuration};
				opacity: {opacityMult};
			"
		></div>
	{/each}
</div>

<style>
	.nebula-container {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		z-index: 0;
	}

	.nebula-blob {
		position: absolute;
		border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%;
		filter: blur(50px);
		will-change: transform, border-radius;
		animation-name: nebula-drift, nebula-morph;
		animation-timing-function: ease-in-out, ease-in-out;
		animation-iteration-count: infinite, infinite;
	}

	@keyframes nebula-drift {
		0% { transform: translate(0, 0) scale(1); }
		33% { transform: translate(30px, -20px) scale(1.05); }
		66% { transform: translate(-20px, 15px) scale(0.95); }
		100% { transform: translate(0, 0) scale(1); }
	}

	@keyframes nebula-morph {
		0%, 100% { border-radius: 60% 40% 55% 45% / 55% 45% 60% 40%; }
		25% { border-radius: 45% 55% 40% 60% / 60% 40% 55% 45%; }
		50% { border-radius: 55% 45% 60% 40% / 40% 60% 45% 55%; }
		75% { border-radius: 40% 60% 45% 55% / 55% 45% 40% 60%; }
	}

	@media (prefers-reduced-motion: reduce) {
		.nebula-blob {
			animation: none;
		}
	}

	@media (max-width: 768px) {
		.nebula-blob:nth-child(n+4) {
			display: none;
		}

		.nebula-blob {
			filter: blur(40px);
		}
	}
</style>
