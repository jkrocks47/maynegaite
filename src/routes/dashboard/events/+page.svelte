<script lang="ts">
	import { EVENT_CATEGORY_LABELS } from '$lib/utils/constants';
	import type { EventCategory } from '$lib/utils/constants';

	let { data } = $props();
</script>

<svelte:head>
	<title>My Events - Maynegaite POA</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6">
	<h1 class="font-display text-3xl text-mg-charcoal">My Events</h1>

	<section class="card-elevated">
		<h2 class="font-display text-2xl text-mg-charcoal mb-3">Upcoming RSVPs</h2>
		{#if data.upcoming.length === 0}
			<p class="text-mg-warmGray">No upcoming RSVPs. Browse the <a href="/events" class="text-mg-forest hover:underline">community calendar</a> to join events.</p>
		{:else}
			<div class="space-y-3">
				{#each data.upcoming as rsvp}
					<a href="/events/{rsvp.eventId}" class="block border border-mg-stone rounded-lg p-4 bg-white no-underline hover:border-mg-forest/40 transition-colors">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<p class="font-semibold text-mg-charcoal">{rsvp.title}</p>
								<p class="text-sm text-mg-warmGray mt-1">{rsvp.date}{rsvp.time ? ` at ${rsvp.time}` : ''} {rsvp.location ? `· ${rsvp.location}` : ''}</p>
							</div>
							<div class="flex items-center gap-2 flex-wrap justify-end">
								<span class="badge badge-green">{EVENT_CATEGORY_LABELS[rsvp.eventCategory as EventCategory]}</span>
								<span
									class="text-xs font-medium px-2 py-1 rounded-full capitalize"
									class:bg-green-100={rsvp.rsvpStatus === 'going'}
									class:text-green-700={rsvp.rsvpStatus === 'going'}
									class:bg-yellow-100={rsvp.rsvpStatus === 'maybe'}
									class:text-yellow-700={rsvp.rsvpStatus === 'maybe'}
									class:bg-red-100={rsvp.rsvpStatus === 'not_going'}
									class:text-red-700={rsvp.rsvpStatus === 'not_going'}
								>{rsvp.rsvpStatus.replace('_', ' ')}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	<section class="card-elevated">
		<h2 class="font-display text-2xl text-mg-charcoal mb-3">Events Attended ({data.attended.length})</h2>
		{#if data.attended.length === 0}
			<p class="text-mg-warmGray">No events attended yet. Use event check-in QR codes when you attend.</p>
		{:else}
			<div class="space-y-3">
				{#each data.attended as event}
					<a href="/events/{event.eventId}" class="block border border-mg-stone rounded-lg p-4 bg-white no-underline hover:border-mg-forest/40 transition-colors">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<p class="font-semibold text-mg-charcoal">{event.title}</p>
								<p class="text-sm text-mg-warmGray mt-1">{event.date}</p>
							</div>
							<span class="badge badge-gray">{EVENT_CATEGORY_LABELS[event.eventCategory as EventCategory]}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>
