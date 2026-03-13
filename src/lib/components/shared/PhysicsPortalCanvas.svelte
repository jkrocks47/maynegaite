<script lang="ts">
	import { browser } from '$app/environment';

	let { hovered = false }: { hovered?: boolean } = $props();

	let canvas: HTMLCanvasElement | undefined = $state();
	let reducedMotion = $state(false);
	let isVisible = $state(true);
	let animId = 0;

	interface Particle {
		angle: number; speed: number; size: number; hue: number; trail: { x: number; y: number; a: number }[]; orbitIdx: number;
	}
	interface Burst {
		x: number; y: number; dots: { vx: number; vy: number; life: number; hue: number }[]; ring: number;
	}
	interface FloatingEq {
		x: number; y: number; dx: number; dy: number; char: string; opacity: number; size: number;
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

		// 3 concentric orbit rings with particles
		const orbits = [
			{ rx: 0.36, ry: 0.2, rotation: 0, rotSpeed: 0.001, tilt: 0 },
			{ rx: 0.28, ry: 0.15, rotation: Math.PI / 3, rotSpeed: -0.0015, tilt: 0.4 },
			{ rx: 0.32, ry: 0.18, rotation: -Math.PI / 4, rotSpeed: 0.0008, tilt: -0.3 },
		];

		const particleCount = isMobile ? 6 : 10;
		const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
			angle: (i / particleCount) * Math.PI * 2 + Math.random() * 0.5,
			speed: 0.01 + Math.random() * 0.012,
			size: 1.8 + Math.random() * 1.8,
			hue: 185 + Math.random() * 35,
			trail: [],
			orbitIdx: i % 3
		}));

		// Floating physics symbols
		const symbols = ['E', 'mc²', 'ψ', 'ℏ', 'λ', '∇', 'Δ', 'π', 'μ', '∞'];
		const floatingEqs: FloatingEq[] = isMobile ? [] : Array.from({ length: 8 }, () => ({
			x: Math.random(), y: Math.random(),
			dx: (Math.random() - 0.5) * 0.0002,
			dy: (Math.random() - 0.5) * 0.0002,
			char: symbols[Math.floor(Math.random() * symbols.length)],
			opacity: 0.04 + Math.random() * 0.06,
			size: 10 + Math.random() * 14
		}));

		let bursts: Burst[] = [];
		let lastTime = 0;
		let lastBurst = 0;
		const burstInterval = 2500;
		let wavePhase = 0;
		let pulsePhase = 0;

		function spawnBurst(x: number, y: number) {
			const dots = Array.from({ length: 14 }, () => ({
				vx: (Math.random() - 0.5) * 6,
				vy: (Math.random() - 0.5) * 6,
				life: 0,
				hue: 185 + Math.random() * 40
			}));
			bursts.push({ x, y, dots, ring: 0 });
		}

		function draw(now: number) {
			animId = requestAnimationFrame(draw);
			if (!isVisible || !canvas || !ctx) return;
			if (now - lastTime < 25) return;
			lastTime = now;

			const w = canvas.width, h = canvas.height;
			const cx = w * 0.5, cy = h * 0.42;
			const scale = Math.min(w, h);
			const speedMul = hovered ? 2.2 : 1;
			const glowMul = hovered ? 2.0 : 1;

			ctx.clearRect(0, 0, w, h);

			if (!reducedMotion) {
				wavePhase += 0.04 * speedMul;
				pulsePhase += 0.02 * speedMul;
				for (const o of orbits) o.rotation += o.rotSpeed * speedMul;
			}

			// Central core glow
			const coreSize = scale * 0.08;
			const corePulse = 0.7 + 0.3 * Math.sin(pulsePhase * 2);
			const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize * 3 * corePulse);
			coreGrad.addColorStop(0, `rgba(14, 165, 233, ${0.12 * glowMul})`);
			coreGrad.addColorStop(0.4, `rgba(56, 189, 248, ${0.05 * glowMul})`);
			coreGrad.addColorStop(1, 'transparent');
			ctx.fillStyle = coreGrad;
			ctx.fillRect(0, 0, w, h);

			// Core dot
			ctx.beginPath();
			ctx.arc(cx, cy, 3 * corePulse * glowMul, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(56, 189, 248, ${0.6 * glowMul})`;
			ctx.fill();
			ctx.beginPath();
			ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * glowMul})`;
			ctx.fill();

			// Orbit rings
			for (const o of orbits) {
				ctx.save();
				ctx.translate(cx, cy);
				ctx.rotate(o.rotation);
				// Main ring
				ctx.beginPath();
				ctx.ellipse(0, 0, o.rx * scale, o.ry * scale, o.tilt, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(14, 165, 233, ${0.1 * glowMul})`;
				ctx.lineWidth = 1.5;
				ctx.setLineDash([6, 10]);
				ctx.stroke();
				ctx.setLineDash([]);
				// Glow ring
				ctx.beginPath();
				ctx.ellipse(0, 0, o.rx * scale, o.ry * scale, o.tilt, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(56, 189, 248, ${0.03 * glowMul})`;
				ctx.lineWidth = 6;
				ctx.stroke();
				ctx.restore();
			}

			// Particles
			for (const p of particles) {
				if (!reducedMotion) p.angle += p.speed * speedMul;

				const o = orbits[p.orbitIdx];
				const cos_r = Math.cos(o.rotation), sin_r = Math.sin(o.rotation);
				const cos_a = Math.cos(p.angle), sin_a = Math.sin(p.angle);
				const cos_t = Math.cos(o.tilt), sin_t = Math.sin(o.tilt);
				const ex = cos_a * o.rx * scale * cos_t - sin_a * o.ry * scale * sin_t;
				const ey = cos_a * o.rx * scale * sin_t + sin_a * o.ry * scale * cos_t;
				const px = cx + ex * cos_r - ey * sin_r;
				const py = cy + ex * sin_r + ey * cos_r;

				p.trail.push({ x: px, y: py, a: 1 });
				if (p.trail.length > 18) p.trail.shift();

				// Trail with gradient
				for (let j = 1; j < p.trail.length; j++) {
					const t = j / p.trail.length;
					ctx.beginPath();
					ctx.moveTo(p.trail[j - 1].x, p.trail[j - 1].y);
					ctx.lineTo(p.trail[j].x, p.trail[j].y);
					ctx.strokeStyle = `hsla(${p.hue}, 85%, 70%, ${t * 0.3 * glowMul})`;
					ctx.lineWidth = p.size * t * 0.8;
					ctx.stroke();
				}

				// Head glow
				ctx.beginPath();
				ctx.arc(px, py, p.size * 4, 0, Math.PI * 2);
				ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${0.1 * glowMul})`;
				ctx.fill();

				// Head
				ctx.beginPath();
				ctx.arc(px, py, p.size * (hovered ? 1.2 : 1), 0, Math.PI * 2);
				ctx.fillStyle = `hsla(${p.hue}, 85%, 85%, ${0.85 * glowMul})`;
				ctx.fill();
			}

			// Collision bursts — more dramatic
			if (!reducedMotion) {
				if (now - lastBurst > burstInterval / (hovered ? 2 : 1)) {
					const bAngle = Math.random() * Math.PI * 2;
					const o = orbits[Math.floor(Math.random() * 3)];
					const bx = cx + Math.cos(bAngle) * o.rx * scale * 0.7;
					const by = cy + Math.sin(bAngle) * o.ry * scale * 0.7;
					spawnBurst(bx, by);
					lastBurst = now;
				}
			}

			for (let i = bursts.length - 1; i >= 0; i--) {
				const b = bursts[i];
				b.ring++;
				let allDead = true;
				// Expanding ring
				if (b.ring < 30) {
					allDead = false;
					const ringR = b.ring * 2;
					const ringA = 1 - b.ring / 30;
					ctx.beginPath();
					ctx.arc(b.x, b.y, ringR, 0, Math.PI * 2);
					ctx.strokeStyle = `rgba(56, 189, 248, ${ringA * 0.25 * glowMul})`;
					ctx.lineWidth = 1;
					ctx.stroke();
				}
				// Scatter particles
				for (const d of b.dots) {
					d.life++;
					if (d.life > 30) continue;
					allDead = false;
					const bx = b.x + d.vx * d.life * 0.8;
					const by = b.y + d.vy * d.life * 0.8;
					const alpha = 1 - d.life / 30;
					ctx.beginPath();
					ctx.arc(bx, by, 1.5 * alpha, 0, Math.PI * 2);
					ctx.fillStyle = `hsla(${d.hue}, 85%, 75%, ${alpha * 0.7 * glowMul})`;
					ctx.fill();
				}
				if (allDead) bursts.splice(i, 1);
			}

			// Floating physics symbols
			if (!isMobile) {
				ctx.font = '12px "JetBrains Mono", monospace';
				for (const eq of floatingEqs) {
					if (!reducedMotion) {
						eq.x += eq.dx * speedMul;
						eq.y += eq.dy * speedMul;
						if (eq.x < -0.05 || eq.x > 1.05) eq.dx *= -1;
						if (eq.y < -0.05 || eq.y > 1.05) eq.dy *= -1;
					}
					ctx.font = `${eq.size}px "JetBrains Mono", monospace`;
					ctx.fillStyle = `rgba(14, 165, 233, ${eq.opacity * glowMul})`;
					ctx.fillText(eq.char, eq.x * w, eq.y * h);
				}
			}

			// Wave functions — more complex, brighter
			if (!isMobile) {
				const waveY = h * 0.8;
				const waveAmp = 16 * glowMul;

				// Probability wave
				ctx.beginPath();
				for (let x = 0; x < w; x += 2) {
					const envelope = Math.sin(x * 0.004 + 0.3) * 0.5 + 0.5;
					const y = waveY + Math.sin(x * 0.03 + wavePhase) * waveAmp * envelope;
					if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
				}
				ctx.strokeStyle = `rgba(14, 165, 233, ${0.12 * glowMul})`;
				ctx.lineWidth = 2;
				ctx.stroke();

				// Standing wave
				ctx.beginPath();
				for (let x = 0; x < w; x += 2) {
					const y = waveY + Math.sin(x * 0.02 + wavePhase * 0.6) * waveAmp * 0.5 * Math.cos(x * 0.008);
					if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
				}
				ctx.strokeStyle = `rgba(56, 189, 248, ${0.07 * glowMul})`;
				ctx.lineWidth = 1.5;
				ctx.stroke();

				// Probability density fill
				ctx.beginPath();
				ctx.moveTo(0, waveY);
				for (let x = 0; x < w; x += 2) {
					const envelope = Math.sin(x * 0.004 + 0.3) * 0.5 + 0.5;
					const y = waveY + Math.sin(x * 0.03 + wavePhase) * waveAmp * envelope;
					ctx.lineTo(x, y);
				}
				ctx.lineTo(w, waveY);
				ctx.closePath();
				const fillGrad = ctx.createLinearGradient(0, waveY - waveAmp, 0, waveY + waveAmp);
				fillGrad.addColorStop(0, `rgba(14, 165, 233, ${0.03 * glowMul})`);
				fillGrad.addColorStop(1, 'transparent');
				ctx.fillStyle = fillGrad;
				ctx.fill();
			}
		}

		animId = requestAnimationFrame(draw);
		return () => { ro.disconnect(); cancelAnimationFrame(animId); };
	});
</script>

<canvas bind:this={canvas} class="absolute inset-0 w-full h-full" style="will-change: transform;" aria-hidden="true"></canvas>
