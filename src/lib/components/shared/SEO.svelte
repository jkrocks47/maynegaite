<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
		image?: string;
	}

	let { title = 'UICSpacetime', description = 'Society of Physics Students at the University of Illinois Chicago', image = '' }: Props = $props();

	const fullTitle = title === 'UICSpacetime' ? title : `${title} | UICSpacetime`;
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
</svelte:head>
