<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		glow?: boolean;
		children: Snippet;
	}

	let { class: className = '', glow = false, children }: Props = $props();
</script>

<div class="glass-panel {glow ? 'glow-indigo' : ''} {className}">
	{@render children()}
</div>
