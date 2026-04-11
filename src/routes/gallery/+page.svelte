<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	let { data } = $props();
	let lightboxImage = $state<string | null>(null);
</script>

<SEO title="Photo Gallery" description="Community photos from the Maynegaite subdivision." />

<div class="py-16 px-4">
	<div class="max-w-5xl mx-auto">
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mb-12">Photo Gallery</h1>

		{#if data.images.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{#each data.images as image}
					<button
						class="aspect-square rounded-lg overflow-hidden hover-lift cursor-pointer border-0 p-0"
						onclick={() => (lightboxImage = image.url)}
					>
						<img
							src={image.thumbnailUrl || image.url}
							alt={image.caption || 'Community photo'}
							class="w-full h-full object-cover"
						/>
					</button>
				{/each}
			</div>
		{:else}
			<div class="card-subtle text-center py-16">
				<p class="text-mg-warmGray text-lg">No photos yet. Check back after our next community event!</p>
			</div>
		{/if}
	</div>
</div>

<!-- Lightbox -->
{#if lightboxImage}
	<div
		class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
		onclick={() => (lightboxImage = null)}
		onkeydown={(e) => e.key === 'Escape' && (lightboxImage = null)}
		role="dialog"
		tabindex="-1"
	>
		<img src={lightboxImage} alt="" class="max-w-full max-h-[90vh] rounded-lg" />
		<button
			class="absolute top-4 right-4 text-white text-3xl bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
			onclick={() => (lightboxImage = null)}
		>&times;</button>
	</div>
{/if}
