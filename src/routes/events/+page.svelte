<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	import { formatDate } from '$lib/utils/dates';
	import { EVENT_CATEGORY_LABELS, EVENT_CATEGORIES } from '$lib/utils/constants';
	import type { EventCategory } from '$lib/utils/constants';

	let { data } = $props();
	let activeFilter = $state<string>('all');

	let filteredEvents = $derived(
		activeFilter === 'all'
			? data.events
			: data.events.filter((e) => e.eventCategory === activeFilter)
	);

	let upcomingEvents = $derived(
		filteredEvents.filter((e) => new Date(e.date + 'T00:00:00') >= new Date(new Date().toDateString()))
	);

	let pastEvents = $derived(
		filteredEvents.filter((e) => new Date(e.date + 'T00:00:00') < new Date(new Date().toDateString()))
	);
</script>

<SEO title="Community Events" description="View upcoming events in the Maynegaite community." />

<div class="py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mb-4">Community Events</h1>

		<!-- Category filter -->
		<div class="flex flex-wrap gap-2 mb-8">
			<button
				class="text-xs font-ui px-3 py-1.5 rounded-full border transition-colors
					{activeFilter === 'all' ? 'bg-mg-forest text-white border-mg-forest' : 'bg-white text-mg-warmGray border-mg-stone hover:border-mg-forest'}"
				onclick={() => (activeFilter = 'all')}
			>All</button>
			{#each EVENT_CATEGORIES as cat}
				<button
					class="text-xs font-ui px-3 py-1.5 rounded-full border transition-colors
						{activeFilter === cat ? 'bg-mg-forest text-white border-mg-forest' : 'bg-white text-mg-warmGray border-mg-stone hover:border-mg-forest'}"
					onclick={() => (activeFilter = cat)}
				>{EVENT_CATEGORY_LABELS[cat]}</button>
			{/each}
		</div>

		<!-- Upcoming -->
		{#if upcomingEvents.length > 0}
			<h2 class="text-lg font-semibold text-mg-charcoal mb-4">Upcoming</h2>
			<div class="space-y-4 mb-12">
				{#each upcomingEvents as event}
					<a href="/events/{event.id}" class="card-elevated hover-lift block no-underline">
						<div class="flex items-start justify-between gap-4">
							<div>
								<span class="badge badge-green text-xs mb-2">{EVENT_CATEGORY_LABELS[event.eventCategory as EventCategory]}</span>
								<h3 class="font-semibold text-mg-charcoal text-lg">{event.title}</h3>
								<p class="text-sm text-mg-warmGray mt-1">
									{formatDate(event.date)}{event.time ? ` at ${event.time}` : ''}
									{event.location ? ` · ${event.location}` : ''}
								</p>
								{#if event.description}
									<p class="text-sm text-mg-warmGray mt-2 line-clamp-2">{event.description}</p>
								{/if}
							</div>
							{#if event.imageUrl}
								<img src={event.imageUrl} alt="" class="w-24 h-24 rounded-lg object-cover flex-shrink-0" />
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="card-subtle text-center py-12 mb-12">
				<p class="text-mg-warmGray">No upcoming events. Check back soon!</p>
			</div>
		{/if}

		<!-- Past events -->
		{#if pastEvents.length > 0}
			<h2 class="text-lg font-semibold text-mg-warmGray mb-4">Past Events</h2>
			<div class="space-y-3">
				{#each pastEvents as event}
					<a href="/events/{event.id}" class="card block no-underline opacity-70 hover:opacity-100 transition-opacity">
						<div class="flex items-center justify-between">
							<div>
								<h3 class="font-medium text-mg-charcoal">{event.title}</h3>
								<p class="text-xs text-mg-warmGray">{formatDate(event.date)}</p>
							</div>
							<span class="badge badge-gray text-xs">Past</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>
