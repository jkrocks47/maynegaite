<script lang="ts">
	import { browser } from '$app/environment';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
	}

	let { class: className = '', children }: Props = $props();

	let wrapper: HTMLDivElement | undefined = $state();
	let mx = $state(0);
	let my = $state(0);
	let reducedMotion = $state(false);
	let isTouch = $state(false);

	$effect(() => {
		if (!browser) return;

		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = mq.matches;
		isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

		if (reducedMotion || isTouch) return;

		let rafId: number;
		let targetX = 0;
		let targetY = 0;

		const onMove = (e: MouseEvent) => {
			targetX = (e.clientX / window.innerWidth - 0.5) * 2;
			targetY = (e.clientY / window.innerHeight - 0.5) * 2;
		};

		const lerp = () => {
			mx += (targetX - mx) * 0.08;
			my += (targetY - my) * 0.08;
			rafId = requestAnimationFrame(lerp);
		};

		window.addEventListener('mousemove', onMove, { passive: true });
		rafId = requestAnimationFrame(lerp);

		return () => {
			window.removeEventListener('mousemove', onMove);
			cancelAnimationFrame(rafId);
		};
	});
</script>

<div
	bind:this={wrapper}
	class={className}
	style="--mx: {mx}; --my: {my};"
>
	{@render children()}
</div>
