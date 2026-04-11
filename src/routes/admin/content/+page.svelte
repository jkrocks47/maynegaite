<script lang="ts">
	import ContentEditor from '$lib/components/admin/ContentEditor.svelte';
	let { data } = $props();

	// Build qualified content map (slug|section → value) to avoid key collisions
	// between pages that share the same section name (e.g. multiple 'page-title')
	let qualifiedContent: Record<string, string> = $derived.by(() => {
		const result: Record<string, string> = {};
		for (const [slug, sections] of Object.entries(data.contentBySlug)) {
			for (const [section, value] of Object.entries(sections)) {
				result[`${slug}|${section}`] = value;
			}
		}
		return result;
	});
</script>

<svelte:head>
	<title>Site Content Editor | Admin</title>
</svelte:head>

<div class="max-w-7xl mx-auto">
	<div class="mb-6">
		<h1 class="text-2xl font-bold text-gray-800">Site Content Editor</h1>
		<p class="text-sm text-gray-500 mt-1">
			Edit text across all pages of the Maynegaite POA website. Click any highlighted area in the preview to jump to its editor.
		</p>
	</div>

	<ContentEditor
		content={qualifiedContent}
		entries={data.entries}
		pageGroups={data.pageGroups}
	/>
</div>
