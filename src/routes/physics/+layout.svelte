<script lang="ts">
	import type { Snippet } from 'svelte';
	import PhysicsNav from '$lib/components/physics/PhysicsNav.svelte';
	import PhysicsFooter from '$lib/components/physics/PhysicsFooter.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="physics-theme bg-physics-light text-physics-dark min-h-screen">
	<PhysicsNav />

	<main class="pt-16">
		{@render children()}
	</main>

	<PhysicsFooter />
</div>
