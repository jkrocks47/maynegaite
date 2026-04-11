<script lang="ts">
	import ContentEditor from '$lib/components/admin/ContentEditor.svelte';
	let { data } = $props();

	// Merge all content from all slugs into one flat object for the editor
	let allContent: Record<string, string> = $derived.by(() => {
		const merged: Record<string, string> = {};
		for (const [, content] of Object.entries(data.contentBySlug)) {
			Object.assign(merged, content);
		}
		return merged;
	});
</script>

<svelte:head>
	<title>Site Content Editor | Admin</title>
</svelte:head>

<div class="max-w-5xl mx-auto">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-gray-800">Site Content Editor</h1>
		<p class="text-sm text-gray-500 mt-1">
			Edit text across all pages of the Maynegaite POA website.
		</p>
	</div>

	<ContentEditor
		content={allContent}
		entries={data.entries}
		pageGroups={data.pageGroups}
	/>
</div>
