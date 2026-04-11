<script lang="ts">
	import { formatDate } from '$lib/utils/dates';
	import RSVPButtons from '$lib/components/shared/RSVPButtons.svelte';
	import SEO from '$lib/components/shared/SEO.svelte';
	import { EVENT_CATEGORY_LABELS } from '$lib/utils/constants';
	import type { EventCategory } from '$lib/utils/constants';

	let { data } = $props();
	const event = $derived(data.event);
	const redirectPath = $derived(`/events/${event.id}`);
	const categoryLabel = $derived(
		EVENT_CATEGORY_LABELS[(event as any).eventCategory as EventCategory] ?? 'Community'
	);
</script>

<SEO title="{event.title} | Maynegaite POA" />

<div class="min-h-screen bg-mg-ivory py-12 px-4">
	<div class="max-w-2xl mx-auto">
		<div class="mb-4">
			<span class="badge badge-green">{categoryLabel}</span>
		</div>

		{#if event.imageUrl}
			<div class="rounded-xl overflow-hidden mb-6">
				<img src={event.imageUrl} alt={event.title} class="w-full h-64 object-cover" />
			</div>
		{/if}

		<div class="card-elevated">
			{#if data.isPast}
				<span class="badge badge-gray mb-3">Past Event</span>
			{/if}

			<h1 class="font-display text-3xl font-bold text-mg-charcoal mb-4">{event.title}</h1>

			<div class="space-y-2 mb-6">
				<div class="flex items-center gap-3 text-mg-charcoal">
					<span>&#128197;</span>
					<span>{formatDate(event.date)}</span>
				</div>
				{#if event.time}
					<div class="flex items-center gap-3 text-mg-charcoal">
						<span>&#128336;</span>
						<span>{event.time}</span>
					</div>
				{/if}
				{#if event.location}
					<div class="flex items-center gap-3">
						<span>&#128205;</span>
						{#if event.locationUrl}
							<a
								href={event.locationUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="text-mg-forest hover:underline"
							>
								{event.location}
							</a>
						{:else}
							<span class="text-mg-charcoal">{event.location}</span>
						{/if}
					</div>
				{/if}
			</div>

			{#if event.description}
				<div class="border-t border-mg-stone pt-4 mb-6">
					<p class="text-mg-charcoal leading-relaxed whitespace-pre-wrap">{event.description}</p>
				</div>
			{/if}

			{#if !data.isPast}
				<div class="border-t border-mg-stone pt-6">
					{#if data.isLoggedIn && data.isVerified}
						<div class="flex gap-4 mb-4 text-sm text-mg-warmGray">
							<span><strong class="text-mg-forest">{data.rsvpCounts.going}</strong> going</span>
							<span><strong class="text-mg-goldDark">{data.rsvpCounts.maybe}</strong> maybe</span>
						</div>
						<RSVPButtons
							eventId={event.id}
							currentStatus={data.memberRsvp}
							isLoggedIn={data.isLoggedIn}
							isVerified={data.isVerified}
							redirectTo={redirectPath}
						/>
					{:else if data.isLoggedIn}
						<p class="text-sm text-mg-warmGray mb-3">Please verify your email to RSVP.</p>
						<a href="/verify-email" class="btn-primary">Verify Email</a>
					{:else}
						<p class="text-sm text-mg-warmGray mb-3">Sign in to RSVP for this event.</p>
						<a href="/login?redirectTo={encodeURIComponent(redirectPath)}" class="btn-primary">Sign In</a>
					{/if}
				</div>
			{/if}
		</div>

		<div class="mt-6 text-center">
			<a href="/events" class="text-sm text-mg-forest hover:underline">&larr; Back to Events</a>
		</div>
	</div>
</div>
