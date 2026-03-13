<script lang="ts">
	import { formatDate } from '$lib/utils/dates';
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Upcoming Events | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">OBSERVE</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				UPCOMING EVENTS
			</h1>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<!-- Events List -->
		{#if data.events.length === 0}
			<GlassPanel class="p-12 text-center">
				<p class="font-mono text-sm tracking-[0.15em] text-astro-cream/50">
					No upcoming events. Check back soon.
				</p>
			</GlassPanel>
		{:else}
			<div class="flex flex-col gap-6">
				{#each data.events as event}
					<a href="/astronomy/events/{event.id}" class="no-underline group">
						<GlassPanel class="p-0 overflow-hidden transition-all duration-300 hover:border-astro-indigo/40">
							<div class="flex flex-col sm:flex-row">
								<!-- Image -->
								{#if event.imageUrl}
									<div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
										<img
											src={event.imageUrl}
											alt={event.title}
											loading="lazy"
											class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
								{/if}

								<!-- Content -->
								<div class="p-6 flex-1">
									<div class="flex items-start justify-between gap-4 mb-3">
										<h2 class="font-display text-xl font-bold text-astro-cream group-hover:text-astro-indigo transition-colors">
											{event.title}
										</h2>
									</div>

									<div class="flex flex-wrap gap-4 mb-4">
										<span class="font-mono text-xs tracking-[0.1em] text-astro-cyan/80">
											{formatDate(event.date)}
										</span>
										{#if event.time}
											<span class="font-mono text-xs tracking-[0.1em] text-astro-cream/50">
												{event.time}
											</span>
										{/if}
										{#if event.location}
											<span class="font-mono text-xs tracking-[0.1em] text-astro-cream/50">
												{event.location}
											</span>
										{/if}
									</div>

									{#if event.description}
										<p class="font-body text-sm text-astro-cream/60 line-clamp-2">
											{event.description}
										</p>
									{/if}
								</div>
							</div>
						</GlassPanel>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>
