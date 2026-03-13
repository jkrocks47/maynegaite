<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>My Events - UICSpacetime</title>
</svelte:head>

<div class="events-page">
	<h1 class="page-title">My Events</h1>

	<section class="section">
		<h2 class="section-title">Upcoming RSVPs</h2>
		{#if data.upcoming.length === 0}
			<p class="empty">No upcoming RSVPs. Browse events to RSVP!</p>
		{:else}
			<div class="event-list">
				{#each data.upcoming as rsvp}
					<a href="/{rsvp.clubType}/events/{rsvp.eventId}" class="event-row">
						<div class="event-info">
							<span class="event-title">{rsvp.title}</span>
							<span class="event-meta">{rsvp.date}{rsvp.time ? ` at ${rsvp.time}` : ''} &middot; {rsvp.location || 'TBD'}</span>
						</div>
						<div class="event-badges">
							<span class="club-badge" class:astro={rsvp.clubType === 'astronomy'} class:phys={rsvp.clubType === 'physics'}>{rsvp.clubType}</span>
							<span class="rsvp-badge" class:going={rsvp.rsvpStatus === 'going'} class:maybe={rsvp.rsvpStatus === 'maybe'}>{rsvp.rsvpStatus?.replace('_', ' ')}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	<section class="section">
		<h2 class="section-title">Events Attended ({data.attended.length})</h2>
		{#if data.attended.length === 0}
			<p class="empty">No events attended yet. Check in at events using the QR code!</p>
		{:else}
			<div class="event-list">
				{#each data.attended as event}
					<div class="event-row">
						<div class="event-info">
							<span class="event-title">{event.title}</span>
							<span class="event-meta">{event.date}</span>
						</div>
						<span class="club-badge" class:astro={event.clubType === 'astronomy'} class:phys={event.clubType === 'physics'}>{event.clubType}</span>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.events-page {
		max-width: 800px;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.section {
		margin-bottom: 2rem;
	}

	.section-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		color: #e5e7eb;
		margin-bottom: 0.75rem;
	}

	.empty {
		font-size: 0.85rem;
		color: #6b7280;
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.event-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #191923;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		text-decoration: none;
		transition: background 0.15s;
	}

	a.event-row:hover {
		background: rgba(79, 70, 229, 0.08);
	}

	.event-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.event-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #e5e7eb;
	}

	.event-meta {
		font-size: 0.75rem;
		color: #6b7280;
	}

	.event-badges {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.club-badge {
		font-size: 0.6rem;
		font-weight: 600;
		padding: 0.15rem 0.4rem;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.club-badge.astro { background: rgba(79, 70, 229, 0.2); color: #a5b4fc; }
	.club-badge.phys { background: rgba(14, 121, 178, 0.2); color: #7dd3fc; }

	.rsvp-badge {
		font-size: 0.65rem;
		font-weight: 500;
		padding: 0.15rem 0.45rem;
		border-radius: 9999px;
		text-transform: capitalize;
	}

	.rsvp-badge.going { background: rgba(34, 197, 94, 0.15); color: #86efac; }
	.rsvp-badge.maybe { background: rgba(234, 179, 8, 0.15); color: #fde047; }
</style>
