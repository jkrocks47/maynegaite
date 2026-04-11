<script lang="ts">
	import '../app.css';
	import CommunityNav from '$lib/components/community/CommunityNav.svelte';
	import CommunityFooter from '$lib/components/community/CommunityFooter.svelte';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: { member: any }; children: Snippet } = $props();
</script>

<div class="min-h-screen flex flex-col bg-mg-ivory">
	<CommunityNav member={data.member} />
	<main class="flex-1">
		{@render children()}
	</main>
	<CommunityFooter />
</div>
