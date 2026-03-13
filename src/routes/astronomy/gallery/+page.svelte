<script lang="ts">
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';

	let { data } = $props();
	let selectedImage = $state<typeof data.images[0] | null>(null);

	function openModal(image: typeof data.images[0]) {
		selectedImage = image;
	}

	function closeModal() {
		selectedImage = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && selectedImage) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>Deep Field Gallery | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-7xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">ARCHIVE</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				DEEP FIELD GALLERY
			</h1>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<!-- Masonry Grid -->
		{#if data.images.length === 0}
			<GlassPanel class="p-12 text-center">
				<p class="font-mono text-sm tracking-[0.15em] text-astro-cream/50">
					No images yet. Check back soon.
				</p>
			</GlassPanel>
		{:else}
			<div class="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
				{#each data.images as image}
					<button
						class="w-full break-inside-avoid cursor-pointer bg-transparent border-0 p-0 text-left"
						onclick={() => openModal(image)}
					>
						<div class="scan-effect rounded-xl overflow-hidden group">
							<img
								src={image.url}
								alt={image.caption || 'Gallery image'}
								class="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-cosmos-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
								{#if image.caption}
									<p class="font-mono text-xs text-astro-cream/90">{image.caption}</p>
								{/if}
							</div>
						</div>
						{#if image.photographer}
							<p class="font-mono text-[10px] tracking-[0.15em] text-astro-cream/30 mt-2 px-1">
								{image.photographer}
							</p>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Lightbox Modal -->
{#if selectedImage}
	<div
		class="fixed inset-0 z-50 bg-cosmos-black/95 backdrop-blur-sm flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
	>
		<button
			class="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer"
			onclick={closeModal}
			aria-label="Close modal"
		></button>

		<div class="relative z-10 max-w-5xl max-h-[90vh] flex flex-col items-center">
			<button
				class="absolute -top-10 right-0 font-mono text-xs tracking-[0.2em] text-astro-cream/50 hover:text-astro-cream transition-colors bg-transparent border-0 cursor-pointer"
				onclick={closeModal}
			>
				CLOSE &times;
			</button>

			<img
				src={selectedImage.url}
				alt={selectedImage.caption || 'Gallery image'}
				class="max-w-full max-h-[80vh] object-contain rounded-lg"
			/>

			<div class="mt-4 text-center">
				{#if selectedImage.caption}
					<p class="font-body text-sm text-astro-cream/80">{selectedImage.caption}</p>
				{/if}
				{#if selectedImage.photographer}
					<p class="font-mono text-[10px] tracking-[0.15em] text-astro-cream/40 mt-1">
						Photo by {selectedImage.photographer}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
