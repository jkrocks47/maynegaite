<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	let { data } = $props();

	const categoryLabels: Record<string, string> = {
		bylaws: 'Bylaws',
		covenant: 'Covenants',
		minutes: 'Meeting Minutes',
		newsletter: 'Newsletters',
		financial: 'Financial Reports',
		other: 'Other Documents'
	};
</script>

<SEO title="Community Documents" description="Access Maynegaite community documents including bylaws, covenants, and meeting minutes." />

<div class="py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mb-4">Community Documents</h1>
		<p class="text-lg text-mg-warmGray mb-12">
			Access important community documents including bylaws, covenants, meeting minutes, and newsletters.
		</p>

		{#if Object.keys(data.grouped).length > 0}
			{#each Object.entries(data.grouped) as [category, docs]}
				<section class="mb-10">
					<h2 class="font-display text-xl font-bold text-mg-charcoal mb-4 border-b border-mg-stone pb-2">
						{categoryLabels[category] ?? category}
					</h2>
					<div class="space-y-3">
						{#each docs as doc}
							<div class="card flex items-center justify-between gap-4">
								<div>
									<h3 class="font-medium text-mg-charcoal">{doc.title}</h3>
									{#if doc.description}
										<p class="text-sm text-mg-warmGray mt-1">{doc.description}</p>
									{/if}
									<p class="text-xs text-mg-warmGray mt-1">
										{doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
									</p>
								</div>
								{#if doc.fileUrl}
									<a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" class="btn-secondary text-xs flex-shrink-0">
										Download
									</a>
								{:else if doc.fileGroupId}
									<a href="/api/images/{doc.fileGroupId}" target="_blank" rel="noopener noreferrer" class="btn-secondary text-xs flex-shrink-0">
										View
									</a>
								{/if}
							</div>
						{/each}
					</div>
				</section>
			{/each}
		{:else}
			<div class="card-subtle text-center py-16">
				<p class="text-mg-warmGray text-lg">No documents available yet. Check back soon.</p>
			</div>
		{/if}
	</div>
</div>
