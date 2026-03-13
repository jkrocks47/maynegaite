<script lang="ts">
	import { browser } from '$app/environment';
	import LunarPhaseViz from '$lib/components/astronomy/LunarPhaseViz.svelte';
	import AmbientParticles from '$lib/components/astronomy/AmbientParticles.svelte';

	let parallaxY = $state(0);
	let reducedMotion = $state(false);
	let mounted = $state(false);

	// Coordinate readout state
	let raH = $state(14);
	let raM = $state(23);
	let decD = $state(41);

	$effect(() => {
		if (!browser) return;
		mounted = true;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const handler = (e: MediaQueryListEvent) => {
			reducedMotion = e.matches;
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	$effect(() => {
		if (!browser || reducedMotion) return;

		const onScroll = () => {
			parallaxY = window.scrollY * 0.3;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	// Incrementing coordinate readout
	$effect(() => {
		if (!browser || reducedMotion) return;

		const interval = setInterval(() => {
			raM = (raM + 1) % 60;
			if (raM === 0) raH = (raH + 1) % 24;
			decD = decD + (Math.random() > 0.5 ? 1 : -1);
			if (decD > 90) decD = 89;
			if (decD < -90) decD = -89;
		}, 2000);

		return () => clearInterval(interval);
	});
</script>

<section class="relative h-screen w-full overflow-hidden bg-cosmos-black">
	<!-- Layer 1: Deep space background with atmospheric gradient -->
	<div class="absolute inset-0 hero-deep-space"></div>

	<!-- Layer 2: Planetary body — massive teal/cyan shrouded sphere -->
	<div class="absolute planetary-body pointer-events-none" aria-hidden="true">
		<!-- Core planet glow -->
		<div class="planet-core"></div>
		<!-- Atmospheric mist layers -->
		<div class="planet-atmosphere planet-atmo-1"></div>
		<div class="planet-atmosphere planet-atmo-2"></div>
		<div class="planet-atmosphere planet-atmo-3"></div>
		<!-- Light rim -->
		<div class="planet-rim"></div>
	</div>

	<!-- Layer 3: Urban cloud/fog overlay at bottom -->
	<div
		class="absolute inset-0 pointer-events-none"
		style="background: linear-gradient(to bottom, transparent 50%, rgba(10,10,15,0.4) 75%, rgba(10,10,15,0.85) 100%);"
	></div>

	<!-- Layer 4: Grid overlay -->
	<div class="absolute inset-0 grid-overlay pointer-events-none opacity-40"></div>

	<!-- Layer 5: Ambient particles (star dust) -->
	<AmbientParticles count={50} color="rgba(200,220,255,0.25)" speed={0.1} />

	<!-- Layer 6: Constellation patterns -->
	<svg class="absolute inset-0 w-full h-full pointer-events-none opacity-50" aria-hidden="true">
		<!-- Orion (left area) -->
		<g class="constellation-group" style="animation-delay: 0s;">
			<circle cx="12%" cy="20%" r="2" fill="rgba(255,255,255,0.35)" />
			<circle cx="14%" cy="25%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="10%" cy="30%" r="2" fill="rgba(255,255,255,0.3)" />
			<circle cx="11%" cy="35%" r="1.5" fill="rgba(255,255,255,0.2)" />
			<circle cx="13%" cy="40%" r="2.5" fill="rgba(255,255,255,0.35)" />
			<circle cx="9%" cy="38%" r="1.5" fill="rgba(255,255,255,0.2)" />
			<circle cx="15%" cy="42%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<line x1="12%" y1="20%" x2="14%" y2="25%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="14%" y1="25%" x2="10%" y2="30%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="10%" y1="30%" x2="11%" y2="35%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="11%" y1="35%" x2="9%" y2="38%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="11%" y1="35%" x2="13%" y2="40%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="11%" y1="35%" x2="15%" y2="42%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
		</g>
		<!-- Cassiopeia W (upper right) -->
		<g class="constellation-group" style="animation-delay: -3s;">
			<circle cx="75%" cy="12%" r="2" fill="rgba(255,255,255,0.3)" />
			<circle cx="78%" cy="18%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="81%" cy="10%" r="2" fill="rgba(255,255,255,0.35)" />
			<circle cx="84%" cy="17%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="87%" cy="11%" r="2" fill="rgba(255,255,255,0.3)" />
			<line x1="75%" y1="12%" x2="78%" y2="18%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="78%" y1="18%" x2="81%" y2="10%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="81%" y1="10%" x2="84%" y2="17%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="84%" y1="17%" x2="87%" y2="11%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
		</g>
		<!-- Big Dipper (lower right) -->
		<g class="constellation-group" style="animation-delay: -6s;">
			<circle cx="70%" cy="65%" r="2" fill="rgba(255,255,255,0.3)" />
			<circle cx="74%" cy="68%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="78%" cy="66%" r="2" fill="rgba(255,255,255,0.3)" />
			<circle cx="82%" cy="68%" r="1.5" fill="rgba(255,255,255,0.25)" />
			<circle cx="84%" cy="72%" r="2" fill="rgba(255,255,255,0.35)" />
			<circle cx="81%" cy="75%" r="1.5" fill="rgba(255,255,255,0.2)" />
			<circle cx="84%" cy="77%" r="2" fill="rgba(255,255,255,0.3)" />
			<line x1="70%" y1="65%" x2="74%" y2="68%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="74%" y1="68%" x2="78%" y2="66%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="78%" y1="66%" x2="82%" y2="68%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="82%" y1="68%" x2="84%" y2="72%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="84%" y1="72%" x2="81%" y2="75%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
			<line x1="81%" y1="75%" x2="84%" y2="77%" stroke="rgba(255,255,255,0.1)" stroke-width="0.5" />
		</g>
	</svg>

	<!-- Layer 7: Technical linework — crosshairs with staggered fade-in -->
	{#each [
		{ top: '15%', left: '10%', delay: 0 },
		{ top: '25%', right: '15%', delay: 200 },
		{ bottom: '30%', left: '20%', delay: 400 },
		{ bottom: '20%', right: '25%', delay: 600 },
		{ top: '60%', left: '45%', delay: 800 },
		{ top: '40%', left: '75%', delay: 1000 },
		{ top: '70%', right: '35%', delay: 1200 }
	] as cross}
		<span
			class="absolute font-mono text-xs text-white/15 pointer-events-none select-none crosshair-anim"
			class:mounted
			style="
				top: {cross.top ?? 'auto'};
				bottom: {cross.bottom ?? 'auto'};
				left: {cross.left ?? 'auto'};
				right: {cross.right ?? 'auto'};
				transition-delay: {cross.delay}ms;
			"
		>+</span>
	{/each}

	<!-- Layer 8: Coordinate dial (top-left) -->
	<div class="absolute top-24 left-6 z-20 hidden lg:block">
		<div class="font-mono text-[10px] tracking-[0.2em] text-white/20 space-y-1">
			<div>RA {String(raH).padStart(2, '0')}h {String(raM).padStart(2, '0')}m</div>
			<div>DEC +{decD}&deg; 12'</div>
			<div class="text-astro-cyan/25">&#9679; TRACKING</div>
		</div>
	</div>

	<!-- Layer 9: Planetary position dial (top-right) -->
	<div class="absolute top-[6%] right-[5%] w-64 h-64 opacity-35 pointer-events-none hidden lg:block">
		<svg viewBox="0 0 220 220" fill="none" class="w-full h-full">
			<defs>
				<path id="textCircle" d="M 110 110 m -95 0 a 95 95 0 1 1 190 0 a 95 95 0 1 1 -190 0" />
			</defs>

			<!-- Outer ring -->
			<circle cx="110" cy="110" r="105" stroke="rgba(34,211,238,0.2)" stroke-width="0.8" class="viewfinder-ring-outer" />
			<!-- Mid ring -->
			<circle cx="110" cy="110" r="85" stroke="rgba(34,211,238,0.15)" stroke-width="0.6" />
			<!-- Inner rings -->
			<circle cx="110" cy="110" r="65" stroke="rgba(34,211,238,0.1)" stroke-width="0.5" />
			<circle cx="110" cy="110" r="45" stroke="rgba(34,211,238,0.08)" stroke-width="0.5" />
			<circle cx="110" cy="110" r="25" stroke="rgba(34,211,238,0.05)" stroke-width="0.5" />

			<!-- Curved text -->
			<text font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.15)" letter-spacing="3">
				<textPath href="#textCircle" startOffset="5%">PLANETARY CHART POSITIONS</textPath>
			</text>
			<text font-family="'JetBrains Mono', monospace" font-size="5" fill="rgba(255,255,255,0.1)" letter-spacing="2">
				<textPath href="#textCircle" startOffset="60%">FOV 2.4&deg; &bull; EQ MOUNT</textPath>
			</text>

			<!-- Crosshairs -->
			<line x1="110" y1="5" x2="110" y2="35" stroke="rgba(255,255,255,0.18)" stroke-width="0.6" />
			<line x1="110" y1="185" x2="110" y2="215" stroke="rgba(255,255,255,0.18)" stroke-width="0.6" />
			<line x1="5" y1="110" x2="35" y2="110" stroke="rgba(255,255,255,0.18)" stroke-width="0.6" />
			<line x1="185" y1="110" x2="215" y2="110" stroke="rgba(255,255,255,0.18)" stroke-width="0.6" />

			<!-- Degree labels -->
			<text x="110" y="18" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.18)">0&deg;</text>
			<text x="202" y="113" text-anchor="start" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.18)">90&deg;</text>
			<text x="110" y="212" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.18)">180&deg;</text>
			<text x="18" y="113" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="6" fill="rgba(255,255,255,0.18)">270&deg;</text>

			<!-- Tick marks -->
			{#each Array(72) as _, i}
				{@const angle = (i * 5 * Math.PI) / 180}
				{@const inner = i % 6 === 0 ? 98 : 101}
				{@const x1 = 110 + inner * Math.cos(angle)}
				{@const y1 = 110 + inner * Math.sin(angle)}
				{@const x2 = 110 + 105 * Math.cos(angle)}
				{@const y2 = 110 + 105 * Math.sin(angle)}
				<line
					{x1} {y1} {x2} {y2}
					stroke="rgba(255,255,255,0.12)"
					stroke-width={i % 18 === 0 ? '1.2' : i % 6 === 0 ? '0.8' : '0.4'}
				/>
			{/each}

			<!-- Arc segments -->
			{#each [45, 135, 225, 315] as deg}
				{@const rad = (deg * Math.PI) / 180}
				{@const ax1 = 110 + 70 * Math.cos(rad - 0.2)}
				{@const ay1 = 110 + 70 * Math.sin(rad - 0.2)}
				{@const ax2 = 110 + 70 * Math.cos(rad + 0.2)}
				{@const ay2 = 110 + 70 * Math.sin(rad + 0.2)}
				<path d="M {ax1} {ay1} A 70 70 0 0 1 {ax2} {ay2}" stroke="rgba(34,211,238,0.2)" stroke-width="1.2" fill="none" />
			{/each}

			<!-- Dashed inner ring -->
			<circle cx="110" cy="110" r="75" stroke="rgba(34,211,238,0.08)" stroke-width="0.4" stroke-dasharray="4 8" class="viewfinder-ring-inner" />

			<!-- Pulsing center -->
			<circle cx="110" cy="110" r="4" stroke="rgba(34,211,238,0.4)" stroke-width="1" fill="none" class="center-pulse" />
			<circle cx="110" cy="110" r="2" fill="rgba(34,211,238,0.3)" class="center-pulse" />

			<!-- Radar sweep -->
			<line x1="110" y1="110" x2="110" y2="8" stroke="rgba(34,211,238,0.15)" stroke-width="0.6" class="radar-line" />
		</svg>
	</div>

	<!-- Layer 10: Main content (centered) -->
	<div
		class="relative z-10 flex flex-col items-center justify-center h-full px-4"
		style="transform: translateY({parallaxY}px)"
	>
		<!-- Colossal distressed headline -->
		<h1 class="text-center font-display font-bold uppercase">
			<span
				class="hero-observe relative block"
				class:mounted
				style="font-size: clamp(4.5rem, 13vw, 12rem); line-height: 0.9;"
			>
				<span class="hero-text-inner">OBSERVE</span>
			</span>
			<span
				class="hero-cosmos block"
				class:mounted
				style="font-size: clamp(3rem, 9vw, 8rem); line-height: 0.95;"
			>
				<span class="hero-text-inner">THE COSMOS</span>
			</span>
		</h1>

		<p class="mt-6 font-body text-sm text-astro-cream/50 text-center max-w-lg hero-subtitle" class:mounted>
			University of Illinois Chicago — Exploring the universe from the urban canopy. EST. 2010.
		</p>

		<!-- CTA: command-line terminal feel -->
		<div class="relative mt-8 cta-wrapper" class:mounted>
			<div class="hud-bracket hud-bracket-tl"></div>
			<div class="hud-bracket hud-bracket-tr"></div>
			<div class="hud-bracket hud-bracket-bl"></div>
			<div class="hud-bracket hud-bracket-br"></div>
			<a href="/astronomy/events" class="cta-terminal">
				[ INITIATE OBSERVATION ]
			</a>
			<div class="cta-scan-line"></div>
		</div>
	</div>

	<!-- Layer 11: Lunar phase viz (right edge) -->
	<div class="absolute right-[-2rem] top-1/2 -translate-y-1/2 opacity-40 pointer-events-none hidden md:block">
		<LunarPhaseViz />
	</div>
</section>

<style>
	/* Deep space background: bruising navies and charcoal blacks */
	.hero-deep-space {
		background:
			radial-gradient(ellipse 120% 100% at 50% 30%, rgba(13,27,42,0.9) 0%, transparent 60%),
			radial-gradient(ellipse 80% 70% at 40% 35%, rgba(20,40,60,0.6) 0%, transparent 50%),
			radial-gradient(ellipse 60% 50% at 60% 40%, rgba(15,35,55,0.4) 0%, transparent 45%),
			linear-gradient(to bottom, #060810 0%, #0a0e18 30%, #0d1520 60%, #0a0a0f 100%);
	}

	/* Massive planetary body — teal/cyan shrouded in mist */
	.planetary-body {
		width: clamp(400px, 55vw, 800px);
		height: clamp(400px, 55vw, 800px);
		top: -5%;
		left: 50%;
		transform: translateX(-50%);
	}

	.planet-core {
		position: absolute;
		inset: 15%;
		border-radius: 50%;
		background: radial-gradient(
			circle at 40% 35%,
			rgba(34,211,238,0.25) 0%,
			rgba(20,100,120,0.35) 25%,
			rgba(13,40,60,0.6) 50%,
			rgba(10,15,25,0.9) 75%,
			transparent 100%
		);
	}

	.planet-atmosphere {
		position: absolute;
		border-radius: 50%;
	}

	.planet-atmo-1 {
		inset: 5%;
		background: radial-gradient(
			circle at 45% 40%,
			rgba(34,211,238,0.12) 0%,
			rgba(34,211,238,0.06) 35%,
			transparent 65%
		);
		filter: blur(40px);
		animation: atmo-drift 25s ease-in-out infinite;
	}

	.planet-atmo-2 {
		inset: 0%;
		background: radial-gradient(
			circle at 55% 45%,
			rgba(20,180,200,0.08) 0%,
			rgba(34,211,238,0.04) 40%,
			transparent 70%
		);
		filter: blur(60px);
		animation: atmo-drift 30s ease-in-out infinite reverse;
	}

	.planet-atmo-3 {
		inset: -10%;
		background: radial-gradient(
			circle at 50% 50%,
			rgba(34,211,238,0.04) 0%,
			rgba(13,27,42,0.06) 50%,
			transparent 80%
		);
		filter: blur(80px);
		animation: atmo-drift 35s ease-in-out infinite;
		animation-delay: -10s;
	}

	.planet-rim {
		position: absolute;
		inset: 12%;
		border-radius: 50%;
		background: transparent;
		box-shadow:
			inset -20px -10px 40px rgba(34,211,238,0.08),
			inset 15px 10px 60px rgba(10,10,15,0.6),
			0 0 80px rgba(34,211,238,0.06),
			0 0 160px rgba(34,211,238,0.03);
	}

	@keyframes atmo-drift {
		0%, 100% { transform: translate(0, 0) scale(1); }
		33% { transform: translate(2%, -1%) scale(1.02); }
		66% { transform: translate(-1%, 2%) scale(0.98); }
	}

	/* Distressed, weathered typography — bone-white with granular texture */
	.hero-observe {
		opacity: 0;
		transform: translateY(40px) scale(0.95);
		transition: opacity 0.8s ease-out, transform 0.8s ease-out, letter-spacing 0.8s ease-out;
		letter-spacing: 0.1em;
	}

	.hero-observe.mounted {
		opacity: 1;
		transform: translateY(0) scale(1);
		letter-spacing: -0.02em;
		transition-delay: 0.3s;
	}

	.hero-text-inner {
		color: #ede8df;
		text-shadow:
			0 0 80px rgba(34,211,238,0.2),
			0 0 160px rgba(34,211,238,0.08);
		/* Granular screen-print texture via background clip */
		background-image:
			url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='0.15' intercept='0'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 256px 256px;
		-webkit-text-fill-color: #ede8df;
		position: relative;
		display: inline-block;
	}

	/* Radial glow behind OBSERVE */
	.hero-observe::after {
		content: '';
		position: absolute;
		top: 5%;
		left: 15%;
		width: 70%;
		height: 90%;
		background: radial-gradient(
			ellipse at center,
			rgba(34, 211, 238, 0.15) 0%,
			rgba(20, 100, 120, 0.08) 40%,
			transparent 70%
		);
		filter: blur(40px);
		pointer-events: none;
		z-index: -1;
	}

	.hero-cosmos {
		opacity: 0;
		transform: translateY(40px) scale(0.95);
		transition: opacity 0.8s ease-out, transform 0.8s ease-out, letter-spacing 0.8s ease-out;
		letter-spacing: 0.1em;
	}

	.hero-cosmos.mounted {
		opacity: 1;
		transform: translateY(0) scale(1);
		letter-spacing: -0.02em;
		transition-delay: 0.5s;
	}

	.hero-subtitle {
		opacity: 0;
		transform: translateY(20px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.hero-subtitle.mounted {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.8s;
	}

	.cta-wrapper {
		opacity: 0;
		transform: translateY(15px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}

	.cta-wrapper.mounted {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 1s;
	}

	/* CTA: typewriter / command-line terminal feel */
	.cta-terminal {
		display: inline-flex;
		align-items: center;
		padding: 0.75rem 2rem;
		border: 1px solid rgba(34, 211, 238, 0.3);
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: #f5f0e8;
		background: rgba(34, 211, 238, 0.05);
		transition: all 0.3s ease;
		cursor: pointer;
		text-decoration: none;
	}

	.cta-terminal:hover {
		background: rgba(34, 211, 238, 0.12);
		border-color: rgba(34, 211, 238, 0.5);
		box-shadow: 0 0 30px rgba(34, 211, 238, 0.15);
		text-shadow: 0 0 10px rgba(34, 211, 238, 0.3);
	}

	/* CTA scanning line */
	.cta-scan-line {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		pointer-events: none;
	}

	.cta-scan-line::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 30%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(34,211,238,0.1), transparent);
		animation: cta-sweep 8s ease-in-out infinite;
	}

	@keyframes cta-sweep {
		0%, 80%, 100% { transform: translateX(-100%); }
		40% { transform: translateX(400%); }
	}

	/* Crosshair fade-in */
	.crosshair-anim {
		opacity: 0;
		transition: opacity 0.6s ease-out;
	}

	.crosshair-anim.mounted {
		opacity: 1;
		animation: crosshair-glow 5s ease-in-out infinite;
	}

	@keyframes crosshair-glow {
		0%, 100% { opacity: 0.12; }
		50% { opacity: 0.3; }
	}

	/* Constellation twinkle */
	:global(.constellation-group) {
		animation: constellation-twinkle 8s ease-in-out infinite;
	}

	@keyframes constellation-twinkle {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 0.9; }
	}

	/* Viewfinder animations */
	.viewfinder-ring-outer {
		transform-origin: 110px 110px;
		animation: vf-rotate 45s linear infinite;
	}

	:global(.viewfinder-ring-inner) {
		transform-origin: 110px 110px;
		animation: vf-rotate 60s linear infinite reverse;
	}

	.center-pulse {
		animation: center-glow 3s ease-in-out infinite;
	}

	.radar-line {
		transform-origin: 110px 110px;
		animation: radar-sweep-anim 20s linear infinite;
		opacity: 0.4;
	}

	@keyframes vf-rotate {
		to { transform: rotate(360deg); }
	}

	@keyframes center-glow {
		0%, 100% { opacity: 0.2; }
		50% { opacity: 0.6; }
	}

	@keyframes radar-sweep-anim {
		to { transform: rotate(360deg); }
	}

	@media (prefers-reduced-motion: reduce) {
		.crosshair-anim {
			opacity: 0.15;
		}

		.crosshair-anim.mounted {
			animation: none;
		}

		.hero-observe,
		.hero-cosmos,
		.hero-subtitle,
		.cta-wrapper {
			opacity: 1;
			transform: none;
			transition: none;
			letter-spacing: -0.02em;
		}

		.cta-scan-line::after {
			animation: none;
		}

		.viewfinder-ring-outer,
		.radar-line {
			animation: none;
		}

		.center-pulse {
			animation: none;
			opacity: 0.4;
		}

		.planet-atmo-1,
		.planet-atmo-2,
		.planet-atmo-3 {
			animation: none;
		}
	}

	/* Mobile: scale down planetary body */
	@media (max-width: 768px) {
		.planetary-body {
			width: 350px;
			height: 350px;
			top: -8%;
		}
	}
</style>
