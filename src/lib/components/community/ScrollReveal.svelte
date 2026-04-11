<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		threshold = 0.1,
		delay = 0,
		children
	}: {
		threshold?: number;
		delay?: number;
		children: Snippet;
	} = $props();

	let element: HTMLElement;
	let visible = $state(false);

	$effect(() => {
		if (!element) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					if (delay > 0) {
						setTimeout(() => (visible = true), delay);
					} else {
						visible = true;
					}
					observer.unobserve(element);
				}
			},
			{ threshold }
		);

		observer.observe(element);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="transition-all duration-600 ease-out
		{visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}"
>
	{@render children()}
</div>
