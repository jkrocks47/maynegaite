<script lang="ts">
	import { browser } from '$app/environment';

	let { hovered = false }: { hovered?: boolean } = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let reducedMotion = $state(false);
	let isVisible = $state(true);
	let animId = 0;

	interface Star {
		x: number; y: number; size: number; opacity: number; twinkleSpeed: number; phase: number; hue: number; drift: number;
	}
	interface Nebula {
		x: number; y: number; r: number; dx: number; dy: number; hue: number; sat: number; alpha: number; pulsePhase: number; pulseSpeed: number;
	}
	interface ShootingStar {
		x: number; y: number; vx: number; vy: number; life: number; maxLife: number;
		trail: { x: number; y: number }[];
	}
	interface Sparkle {
		x: number; y: number; life: number; maxLife: number; size: number; hue: number;
	}

	$effect(() => {
		if (!browser) return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		const h = (e: MediaQueryListEvent) => (reducedMotion = e.matches);
		mq.addEventListener('change', h);
		return () => mq.removeEventListener('change', h);
	});

	$effect(() => {
		if (!browser || !canvas) return;
		const obs = new IntersectionObserver(([e]) => (isVisible = e.isIntersecting), { threshold: 0 });
		obs.observe(canvas);
		return () => obs.disconnect();
	});

	$effect(() => {
		if (!browser || !canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const parent = canvas.parentElement!;
		const ro = new ResizeObserver(() => {
			canvas!.width = parent.clientWidth;
			canvas!.height = parent.clientHeight;
		});
		ro.observe(parent);
		canvas.width = parent.clientWidth;
		canvas.height = parent.clientHeight;

		const isMobile = window.innerWidth < 768;
		const starCount = isMobile ? 50 : 90;

		const stars: Star[] = Array.from({ length: starCount }, (_, i) => ({
			x: Math.random(),
			y: Math.random(),
			size: i < 10 ? 1.5 + Math.random() * 2 : 0.4 + Math.random() * 1.4,
			opacity: 0.15 + Math.random() * 0.85,
			twinkleSpeed: 0.3 + Math.random() * 2.5,
			phase: Math.random() * Math.PI * 2,
			hue: Math.random() > 0.5 ? 240 + Math.random() * 60 : (Math.random() > 0.7 ? 180 + Math.random() * 20 : 0),
			drift: (Math.random() - 0.5) * 0.00008
		}));

		// Two constellation patterns
		const c1Stars = stars.slice(0, 6);
		const c2Stars = stars.slice(6, 11);
		const lines1 = [{ f: 0, t: 1 }, { f: 1, t: 2 }, { f: 2, t: 3 }, { f: 3, t: 4 }, { f: 2, t: 5 }];
		const lines2 = [{ f: 0, t: 1 }, { f: 1, t: 2 }, { f: 2, t: 3 }, { f: 3, t: 4 }];

		const nebulae: Nebula[] = [
			{ x: 0.75, y: 0.25, r: 0.4, dx: 0.0003, dy: 0.0002, hue: 270, sat: 70, alpha: 0.1, pulsePhase: 0, pulseSpeed: 0.8 },
			{ x: 0.2, y: 0.65, r: 0.35, dx: -0.00025, dy: 0.00015, hue: 210, sat: 60, alpha: 0.08, pulsePhase: 2, pulseSpeed: 0.6 },
			{ x: 0.5, y: 0.35, r: 0.3, dx: 0.00015, dy: -0.0003, hue: 290, sat: 80, alpha: 0.09, pulsePhase: 4, pulseSpeed: 1.0 },
			{ x: 0.35, y: 0.15, r: 0.2, dx: -0.0002, dy: 0.0001, hue: 190, sat: 50, alpha: 0.06, pulsePhase: 1, pulseSpeed: 0.7 },
		];

		let shootingStars: ShootingStar[] = [];
		let sparkles: Sparkle[] = [];
		let lastTime = 0;
		let lastShoot = 0;
		let lastSparkle = 0;
		const shootInterval = isMobile ? 999999 : 3500;

		function spawnShoot() {
			const w = canvas!.width, h = canvas!.height;
			const dir = Math.random() > 0.5 ? 1 : -1;
			shootingStars.push({
				x: dir > 0 ? Math.random() * w * 0.4 : w * 0.6 + Math.random() * w * 0.4,
				y: Math.random() * h * 0.4,
				vx: (4 + Math.random() * 4) * dir,
				vy: 1.5 + Math.random() * 2,
				life: 0, maxLife: 35 + Math.random() * 25, trail: []
			});
		}

		function draw(now: number) {
			animId = requestAnimationFrame(draw);
			if (!isVisible || !canvas || !ctx) return;
			if (now - lastTime < 25) return; // ~40fps for smoother feel
			lastTime = now;

			const w = canvas.width, h = canvas.height;
			ctx.clearRect(0, 0, w, h);

			const time = now * 0.001;
			const hMul = hovered ? 2.0 : 1;
			const gMul = hovered ? 1.8 : 1;

			// Nebulae with pulsing
			for (const n of nebulae) {
				if (!reducedMotion) {
					n.x += n.dx * (hovered ? 3 : 1);
					n.y += n.dy * (hovered ? 3 : 1);
					if (n.x < -0.3 || n.x > 1.3) n.dx *= -1;
					if (n.y < -0.3 || n.y > 1.3) n.dy *= -1;
				}
				const pulse = 0.7 + 0.3 * Math.sin(time * n.pulseSpeed + n.pulsePhase);
				const alpha = n.alpha * gMul * pulse;
				const r = n.r * (0.9 + 0.1 * Math.sin(time * 0.5 + n.pulsePhase));

				const grad = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, r * w);
				grad.addColorStop(0, `hsla(${n.hue}, ${n.sat}%, 50%, ${alpha})`);
				grad.addColorStop(0.5, `hsla(${n.hue}, ${n.sat}%, 40%, ${alpha * 0.4})`);
				grad.addColorStop(1, 'transparent');
				ctx.fillStyle = grad;
				ctx.fillRect(0, 0, w, h);
			}

			// Constellation lines with animated glow
			const lineAlpha = (0.08 + 0.04 * Math.sin(time * 0.5)) * gMul;
			ctx.lineWidth = 1;

			function drawConstellation(cStars: Star[], cLines: { f: number; t: number }[]) {
				for (const l of cLines) {
					const a = cStars[l.f], b = cStars[l.t];
					if (!a || !b) continue;
					const grad = ctx.createLinearGradient(a.x * w, a.y * h, b.x * w, b.y * h);
					grad.addColorStop(0, `rgba(168, 130, 255, ${lineAlpha})`);
					grad.addColorStop(0.5, `rgba(130, 200, 255, ${lineAlpha * 0.8})`);
					grad.addColorStop(1, `rgba(168, 130, 255, ${lineAlpha})`);
					ctx.strokeStyle = grad;
					ctx.beginPath();
					ctx.moveTo(a.x * w, a.y * h);
					ctx.lineTo(b.x * w, b.y * h);
					ctx.stroke();
				}
				// Junction dots
				for (const s of cStars) {
					ctx.beginPath();
					ctx.arc(s.x * w, s.y * h, 2.5 * gMul, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(180, 160, 255, ${lineAlpha * 1.5})`;
					ctx.fill();
				}
			}
			drawConstellation(c1Stars, lines1);
			drawConstellation(c2Stars, lines2);

			// Stars with drift
			for (const s of stars) {
				if (!reducedMotion) {
					s.y -= 0.00003 * hMul;
					s.x += s.drift * hMul;
					if (s.y < -0.02) { s.y = 1.02; s.x = Math.random(); }
					if (s.x < -0.02) s.x = 1.02;
					if (s.x > 1.02) s.x = -0.02;
				}

				const twinkle = 0.3 + 0.7 * Math.sin(time * s.twinkleSpeed + s.phase);
				const alpha = s.opacity * twinkle * Math.min(gMul, 1.5);
				const sz = s.size * (hovered ? 1.3 : 1);

				// Cross-spike for bright stars
				if (s.size > 1.8) {
					const spLen = sz * 5;
					const spAlpha = alpha * 0.15;
					ctx.strokeStyle = s.hue > 0
						? `hsla(${s.hue}, 70%, 85%, ${spAlpha})`
						: `rgba(255, 255, 255, ${spAlpha})`;
					ctx.lineWidth = 0.5;
					ctx.beginPath();
					ctx.moveTo(s.x * w - spLen, s.y * h);
					ctx.lineTo(s.x * w + spLen, s.y * h);
					ctx.moveTo(s.x * w, s.y * h - spLen);
					ctx.lineTo(s.x * w, s.y * h + spLen);
					ctx.stroke();

					// Glow halo
					ctx.beginPath();
					ctx.arc(s.x * w, s.y * h, sz * 4, 0, Math.PI * 2);
					ctx.fillStyle = s.hue > 0
						? `hsla(${s.hue}, 70%, 80%, ${alpha * 0.15})`
						: `rgba(255, 255, 255, ${alpha * 0.12})`;
					ctx.fill();
				}

				ctx.beginPath();
				ctx.arc(s.x * w, s.y * h, sz, 0, Math.PI * 2);
				ctx.fillStyle = s.hue > 0
					? `hsla(${s.hue}, 70%, 88%, ${alpha})`
					: `rgba(255, 255, 255, ${alpha})`;
				ctx.fill();
			}

			// Sparkles (random twinkling bursts)
			if (!reducedMotion) {
				if (now - lastSparkle > (hovered ? 200 : 600)) {
					sparkles.push({
						x: Math.random() * w, y: Math.random() * h,
						life: 0, maxLife: 20 + Math.random() * 15,
						size: 1 + Math.random() * 2,
						hue: Math.random() > 0.5 ? 260 : 200
					});
					lastSparkle = now;
				}
				for (let i = sparkles.length - 1; i >= 0; i--) {
					const sp = sparkles[i];
					sp.life++;
					const t = sp.life / sp.maxLife;
					const a = t < 0.3 ? t / 0.3 : 1 - (t - 0.3) / 0.7;
					ctx.beginPath();
					ctx.arc(sp.x, sp.y, sp.size * a * gMul, 0, Math.PI * 2);
					ctx.fillStyle = `hsla(${sp.hue}, 80%, 85%, ${a * 0.5})`;
					ctx.fill();
					if (sp.life >= sp.maxLife) sparkles.splice(i, 1);
				}
			}

			// Shooting stars - more frequent, brighter
			if (!reducedMotion && !isMobile) {
				if (now - lastShoot > shootInterval / (hovered ? 2 : 1)) { spawnShoot(); lastShoot = now; }
				for (let i = shootingStars.length - 1; i >= 0; i--) {
					const ss = shootingStars[i];
					ss.trail.push({ x: ss.x, y: ss.y });
					if (ss.trail.length > 16) ss.trail.shift();
					ss.x += ss.vx * (hovered ? 1.3 : 1);
					ss.y += ss.vy * (hovered ? 1.3 : 1);
					ss.life++;

					const fadeIn = Math.min(ss.life / 3, 1);
					const fadeOut = Math.max(1 - (ss.life - ss.maxLife * 0.5) / (ss.maxLife * 0.5), 0);
					const a = Math.min(fadeIn, fadeOut);

					// Glowing trail
					for (let j = 0; j < ss.trail.length; j++) {
						const t = j / ss.trail.length;
						ctx.beginPath();
						ctx.arc(ss.trail[j].x, ss.trail[j].y, 2 * t, 0, Math.PI * 2);
						ctx.fillStyle = `rgba(200, 180, 255, ${a * t * 0.6})`;
						ctx.fill();
					}
					// Bright head with halo
					ctx.beginPath();
					ctx.arc(ss.x, ss.y, 5, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(200, 180, 255, ${a * 0.15})`;
					ctx.fill();
					ctx.beginPath();
					ctx.arc(ss.x, ss.y, 2.5, 0, Math.PI * 2);
					ctx.fillStyle = `rgba(255, 255, 255, ${a * 0.9})`;
					ctx.fill();

					if (ss.life >= ss.maxLife) shootingStars.splice(i, 1);
				}
			}

			// Subtle scan line (horizontal sweep)
			if (!reducedMotion) {
				const scanY = (time * 30) % (h + 40) - 20;
				const scanGrad = ctx.createLinearGradient(0, scanY - 15, 0, scanY + 15);
				scanGrad.addColorStop(0, 'transparent');
				scanGrad.addColorStop(0.5, `rgba(168, 130, 255, ${0.02 * gMul})`);
				scanGrad.addColorStop(1, 'transparent');
				ctx.fillStyle = scanGrad;
				ctx.fillRect(0, scanY - 15, w, 30);
			}
		}

		animId = requestAnimationFrame(draw);
		return () => { ro.disconnect(); cancelAnimationFrame(animId); };
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full" style="will-change: transform;" aria-hidden="true"></canvas>
