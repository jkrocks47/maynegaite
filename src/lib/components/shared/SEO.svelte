<script lang="ts">
	let {
		title = 'Maynegaite POA',
		description = "Maynegaite Property Owners' Association — Olympia Fields, Illinois"
	}: { title?: string; description?: string } = $props();

	const fullTitle = title === 'Maynegaite POA' ? title : `${title} | Maynegaite POA`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
</svelte:head>
