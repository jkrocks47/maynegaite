<script lang="ts">
	let { data } = $props();

	let progressPercent = $derived(
		Math.min(100, (data.eventsAttended / data.activeThreshold) * 100)
	);
	let isActive = $derived(data.eventsAttended >= data.activeThreshold);
</script>

<svelte:head>
	<title>Dashboard - UICSpacetime</title>
</svelte:head>

<div class="dashboard-overview">
	<h1 class="page-title">Welcome, {data.member.firstName}</h1>

	<!-- Stats cards -->
	<div class="stats-grid">
		<div class="stat-card">
			<span class="stat-label">Club Memberships</span>
			<div class="stat-clubs">
				{#if data.member.astronomyMember}<span class="club-tag astro">Astronomy</span>{/if}
				{#if data.member.physicsMember}<span class="club-tag phys">Physics</span>{/if}
			</div>
		</div>

		<div class="stat-card">
			<span class="stat-label">Events Attended</span>
			<span class="stat-value">{data.eventsAttended}</span>
		</div>

		<div class="stat-card">
			<span class="stat-label">Active Member Status</span>
			<div class="progress-section">
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progressPercent}%"></div>
				</div>
				<span class="progress-text">
					{#if isActive}
						<span class="active-badge">Active</span>
					{:else}
						{data.eventsAttended} / {data.activeThreshold} events
					{/if}
				</span>
			</div>
		</div>
	</div>

	<!-- Upcoming RSVP'd events -->
	<section class="section">
		<h2 class="section-title">Upcoming Events</h2>
		{#if data.upcomingRsvps.length === 0}
			<p class="empty">No upcoming RSVPs. Browse <a href="/astronomy/events">Astronomy</a> or <a href="/physics/events">Physics</a> events to RSVP.</p>
		{:else}
			<div class="event-list">
				{#each data.upcomingRsvps as rsvp}
					<a href="/{rsvp.clubType}/events/{rsvp.eventId}" class="event-row">
						<div class="event-info">
							<span class="event-title">{rsvp.title}</span>
							<span class="event-meta">{rsvp.date}{rsvp.time ? ` at ${rsvp.time}` : ''} &middot; {rsvp.location || 'TBD'}</span>
						</div>
						<div class="event-badges">
							<span class="club-mini" class:astro={rsvp.clubType === 'astronomy'} class:phys={rsvp.clubType === 'physics'}>{rsvp.clubType}</span>
							<span class="rsvp-badge" class:going={rsvp.rsvpStatus === 'going'} class:maybe={rsvp.rsvpStatus === 'maybe'}>{rsvp.rsvpStatus?.replace('_', ' ')}</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>

	<!-- Recent check-ins -->
	<section class="section">
		<h2 class="section-title">Recent Check-ins</h2>
		{#if data.recentCheckins.length === 0}
			<p class="empty">No check-ins yet. Attend events and scan the QR code to check in!</p>
		{:else}
			<div class="event-list">
				{#each data.recentCheckins as checkin}
					<div class="event-row">
						<div class="event-info">
							<span class="event-title">{checkin.title}</span>
							<span class="event-meta">{checkin.date}</span>
						</div>
						<span class="club-mini" class:astro={checkin.clubType === 'astronomy'} class:phys={checkin.clubType === 'physics'}>{checkin.clubType}</span>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	.dashboard-overview {
		max-width: 800px;
	}

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat-card {
		background: #191923;
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 0.5rem;
		padding: 1.25rem;
	}

	.stat-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 600;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-bottom: 0.5rem;
	}

	.stat-value {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2rem;
		font-weight: 700;
		color: #fff;
	}

	.stat-clubs {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.club-tag {
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.65rem;
		border-radius: 9999px;
	}

	.club-tag.astro { background: rgba(79, 70, 229, 0.2); color: #a5b4fc; }
	.club-tag.phys { background: rgba(14, 121, 178, 0.2); color: #7dd3fc; }

	.progress-section {
		margin-top: 0.25rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 0.4rem;
	}

	.progress-fill {
		height: 100%;
		background: #4f46e5;
		border-radius: 4px;
		transition: width 0.5s ease;
	}

	.progress-text {
		font-size: 0.75rem;
		color: #9ca3af;
	}

	.active-badge {
		color: #22c55e;
		font-weight: 600;
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

	.empty a {
		color: #818cf8;
		text-decoration: none;
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

	.club-mini {
		font-size: 0.6rem;
		font-weight: 600;
		padding: 0.15rem 0.4rem;
		border-radius: 9999px;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.club-mini.astro { background: rgba(79, 70, 229, 0.2); color: #a5b4fc; }
	.club-mini.phys { background: rgba(14, 121, 178, 0.2); color: #7dd3fc; }

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
