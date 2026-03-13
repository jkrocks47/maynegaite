<script lang="ts">
	import { browser } from '$app/environment';
	import AmbientParticles from '$lib/components/astronomy/AmbientParticles.svelte';
	import EventCalendar from '$lib/components/shared/EventCalendar.svelte';

	let { data } = $props();
	let mounted = $state(false);

	$effect(() => {
		if (!browser) return;
		mounted = true;
	});
</script>

<svelte:head>
	<title>UICSpacetime — Society of Physics Students at UIC</title>
	<meta name="description" content="Society of Physics Students at the University of Illinois Chicago — Astronomy & Physics Clubs" />
</svelte:head>

<div class="page">
	{#if mounted}
		<AmbientParticles count={15} color="rgba(206, 17, 38, 0.12)" speed={0.1} />
	{/if}

	<!-- HEADER BANNER — compact branding + club links -->
	<header class="site-header" class:visible={mounted}>
		<div class="header-inner">
			<div class="branding">
				<div class="logo-glow"></div>
				<h1 class="logo">
					<span class="logo-uic">UIC</span>
					<span class="logo-spacetime">Spacetime</span>
				</h1>
				<p class="sps-title">Society of Physics Students at UIC</p>
			</div>

			<div class="header-right">
			<a href="/login" class="login-link">Login</a>
			<nav class="club-nav">
				<a href="/astronomy" class="portal-card portal-astro" data-sveltekit-preload-data="hover">
					<div class="portal-bg">
						<span class="star s1"></span>
						<span class="star s2"></span>
						<span class="star s3"></span>
						<span class="star s4"></span>
						<span class="star s5"></span>
					</div>
					<div class="portal-content">
						<span class="portal-label">Astronomy Club</span>
						<span class="portal-hint">Explore the cosmos &rarr;</span>
					</div>
					<div class="portal-glow glow-astro"></div>
				</a>
				<a href="/physics" class="portal-card portal-phys" data-sveltekit-preload-data="hover">
					<div class="portal-bg">
						<div class="atom">
							<span class="nucleus"></span>
							<span class="orbit o1"></span>
							<span class="orbit o2"></span>
						</div>
					</div>
					<div class="portal-content">
						<span class="portal-label">Physics Club</span>
						<span class="portal-hint">Understand the universe &rarr;</span>
					</div>
					<div class="portal-glow glow-phys"></div>
				</a>
			</nav>
			</div>
		</div>
	</header>

	<!-- CALENDAR — the main content, front and center -->
	<main class="calendar-main" class:visible={mounted}>
		<EventCalendar events={data.upcomingEvents} />
	</main>

	<!-- FOOTER -->
	<footer class="site-footer">
		<p>SPS <span class="sep">+</span> UIC <span class="sep">+</span> CHICAGO <span class="sep">+</span> EST. 2010</p>
	</footer>
</div>

<style>
	.page {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(
			160deg,
			#060e18 0%,
			#0d1b2a 30%,
			#1b2838 55%,
			#9B0A1A 90%,
			#CE1126 100%
		);
		overflow: hidden;
	}

	/* ---- HEADER ---- */
	.site-header {
		position: relative;
		z-index: 2;
		padding: 2.5rem 2rem 2rem;
		opacity: 0;
		transform: translateY(-10px);
		transition: opacity 0.6s ease, transform 0.6s ease;
	}

	.site-header.visible {
		opacity: 1;
		transform: translateY(0);
	}

	.header-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 2rem;
	}

	.branding {
		position: relative;
	}

	.logo-glow {
		position: absolute;
		top: 50%;
		left: 0;
		width: 200px;
		height: 200px;
		transform: translate(-30%, -50%);
		background: radial-gradient(
			circle,
			rgba(206, 17, 38, 0.2) 0%,
			transparent 70%
		);
		filter: blur(40px);
		pointer-events: none;
		animation: glow-breathe 4s ease-in-out infinite;
	}

	.logo {
		position: relative;
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		line-height: 1;
	}

	.logo-uic {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2.8rem;
		font-weight: 700;
		color: #fff;
		text-shadow:
			0 0 20px rgba(206, 17, 38, 0.5),
			0 0 40px rgba(206, 17, 38, 0.2);
	}

	.logo-spacetime {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.6rem;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.85);
		letter-spacing: 0.08em;
	}

	.sps-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.15rem;
		font-weight: 600;
		color: #f5f0e8;
		letter-spacing: 0.03em;
		margin-top: 0.35rem;
		opacity: 0.75;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.login-link {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(245, 240, 232, 0.6);
		text-decoration: none;
		border: 1px solid rgba(245, 240, 232, 0.2);
		padding: 0.4rem 1rem;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.login-link:hover {
		color: #f5f0e8;
		border-color: rgba(206, 17, 38, 0.6);
		background: rgba(206, 17, 38, 0.1);
	}

	/* ---- PORTAL CARDS ---- */
	.club-nav {
		display: flex;
		gap: 1rem;
	}

	.portal-card {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		width: 200px;
		height: 120px;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid rgba(245, 240, 232, 0.08);
		transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
		cursor: pointer;
	}

	.portal-card:hover {
		transform: translateY(-3px);
	}

	/* Backgrounds */
	.portal-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.portal-astro .portal-bg {
		background: linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(79, 70, 229, 0.15) 100%);
	}

	.portal-phys .portal-bg {
		background: linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(14, 121, 178, 0.15) 100%);
	}

	/* Starfield for astronomy */
	.star {
		position: absolute;
		width: 3px;
		height: 3px;
		border-radius: 50%;
		background: #c4b5fd;
		animation: twinkle 3s ease-in-out infinite;
	}

	.s1 { top: 18%; left: 22%; animation-delay: 0s; }
	.s2 { top: 55%; left: 72%; animation-delay: 0.8s; width: 2px; height: 2px; }
	.s3 { top: 30%; left: 55%; animation-delay: 1.5s; width: 2.5px; height: 2.5px; }
	.s4 { top: 72%; left: 30%; animation-delay: 2.2s; width: 2px; height: 2px; }
	.s5 { top: 15%; left: 80%; animation-delay: 0.5s; width: 1.5px; height: 1.5px; }

	.portal-astro:hover .star {
		background: #e0d5ff;
		box-shadow: 0 0 6px rgba(196, 181, 253, 0.8);
	}

	@keyframes twinkle {
		0%, 100% { opacity: 0.2; transform: scale(1); }
		50% { opacity: 1; transform: scale(1.4); }
	}

	/* Atom for physics */
	.atom {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 70px;
		height: 70px;
		transform: translate(-50%, -50%);
	}

	.nucleus {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(14, 121, 178, 0.5);
		transform: translate(-50%, -50%);
	}

	.orbit {
		position: absolute;
		top: 50%;
		left: 50%;
		border: 1px solid rgba(14, 121, 178, 0.2);
		border-radius: 50%;
		transform-origin: center;
	}

	.o1 {
		width: 60px;
		height: 24px;
		margin-top: -12px;
		margin-left: -30px;
		animation: spin-orbit 8s linear infinite;
	}

	.o2 {
		width: 55px;
		height: 20px;
		margin-top: -10px;
		margin-left: -27.5px;
		animation: spin-orbit 12s linear infinite reverse;
		transform: rotate(60deg);
	}

	.portal-phys:hover .orbit {
		border-color: rgba(14, 121, 178, 0.45);
	}

	.portal-phys:hover .nucleus {
		background: rgba(14, 121, 178, 0.8);
		box-shadow: 0 0 8px rgba(14, 121, 178, 0.6);
	}

	@keyframes spin-orbit {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
	}

	/* Content overlay */
	.portal-content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.3rem;
		text-align: center;
	}

	.portal-label {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1rem;
		font-weight: 700;
		color: #f5f0e8;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.portal-hint {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.6rem;
		color: rgba(245, 240, 232, 0.35);
		letter-spacing: 0.08em;
		transition: color 0.3s ease;
	}

	.portal-card:hover .portal-hint {
		color: rgba(245, 240, 232, 0.7);
	}

	/* Bottom glow line */
	.portal-glow {
		position: absolute;
		bottom: 0;
		left: 50%;
		height: 2px;
		width: 0%;
		transform: translateX(-50%);
		border-radius: 1px;
		transition: width 0.35s ease;
	}

	.glow-astro {
		background: #a855f7;
		box-shadow: 0 0 8px rgba(168, 85, 247, 0.5);
	}

	.glow-phys {
		background: #0e79b2;
		box-shadow: 0 0 8px rgba(14, 121, 178, 0.5);
	}

	.portal-card:hover .portal-glow {
		width: 80%;
	}

	/* Hover borders */
	.portal-astro:hover {
		border-color: rgba(168, 85, 247, 0.35);
		box-shadow: 0 4px 24px rgba(168, 85, 247, 0.12), 0 0 40px rgba(168, 85, 247, 0.06);
	}

	.portal-phys:hover {
		border-color: rgba(14, 121, 178, 0.35);
		box-shadow: 0 4px 24px rgba(14, 121, 178, 0.12), 0 0 40px rgba(14, 121, 178, 0.06);
	}

	@keyframes glow-breathe {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}

	/* ---- CALENDAR MAIN ---- */
	.calendar-main {
		position: relative;
		z-index: 2;
		opacity: 0;
		transform: translateY(15px);
		transition: opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s;
	}

	.calendar-main.visible {
		opacity: 1;
		transform: translateY(0);
	}

	/* ---- FOOTER ---- */
	.site-footer {
		position: relative;
		z-index: 2;
		text-align: center;
		padding: 2rem 1rem 2.5rem;
	}

	.site-footer p {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		color: rgba(245, 240, 232, 0.25);
		text-transform: uppercase;
	}

	.sep {
		color: rgba(206, 17, 38, 0.5);
		margin: 0 0.3rem;
	}

	/* ---- MOBILE ---- */
	@media (max-width: 768px) {
		.header-inner {
			flex-direction: column;
			align-items: flex-start;
			gap: 1.25rem;
		}

		.logo-uic {
			font-size: 2.2rem;
		}

		.logo-spacetime {
			font-size: 1.2rem;
		}

		.sps-title {
			font-size: 0.95rem;
		}

		.club-nav {
			width: 100%;
		}

		.portal-card {
			flex: 1;
			width: auto;
			height: 100px;
		}

		.site-header {
			padding: 1.5rem 1.25rem 1rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.site-header,
		.calendar-main {
			opacity: 1;
			transform: none;
			transition: none;
		}

		.logo-glow {
			animation: none;
			opacity: 0.5;
		}

		.portal-card {
			transition: none;
		}

		.star {
			animation: none;
			opacity: 0.5;
		}

		.orbit {
			animation: none;
		}

		.portal-hint {
			transition: none;
		}

		.portal-glow {
			transition: none;
		}
	}
</style>
