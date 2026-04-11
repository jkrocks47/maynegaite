<script lang="ts">
	import type { RsvpStatus, EventCategory } from '$lib/utils/constants';
	import { EVENT_CATEGORY_LABELS } from '$lib/utils/constants';

	let { data } = $props();

	let rsvpStatuses = $state<Record<string, RsvpStatus | null>>({});
	let rsvpLoading = $state<Record<string, boolean>>({});
	let expandedRsvp = $state<string | null>(null);

	function getStatus(eventId: string, original: string | null): RsvpStatus | null {
		return rsvpStatuses[eventId] ?? (original as RsvpStatus | null);
	}

	function formatStatus(status: RsvpStatus | null): string {
		if (!status) return 'RSVP';
		return status.replace('_', ' ');
	}

	async function changeRsvp(eventId: string, newStatus: RsvpStatus) {
		if (rsvpLoading[eventId]) return;
		rsvpLoading[eventId] = true;

		try {
			const res = await fetch('/api/member/rsvp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventId, status: newStatus })
			});
			if (res.ok) {
				rsvpStatuses[eventId] = newStatus;
			}
		} finally {
			rsvpLoading[eventId] = false;
		}
	}

	function toggleRsvpPicker(eventId: string) {
		expandedRsvp = expandedRsvp === eventId ? null : eventId;
	}
</script>

<svelte:head>
	<title>Dashboard - Maynegaite POA</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6">
	<section class="card-elevated">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<h1 class="font-display text-3xl text-mg-charcoal">Welcome, {data.member.firstName}</h1>
				<p class="text-mg-warmGray mt-1">Manage your homeowner account, community events, and preferences.</p>
			</div>
			<div class="flex gap-2 flex-wrap">
				{#if data.member.adminRole}
					<a href="/admin" class="btn-secondary text-sm">Admin Panel</a>
				{/if}
				{#if data.communityInfo?.paymentUrl}
					<a href={data.communityInfo.paymentUrl} target="_blank" rel="noopener noreferrer" class="btn-gold text-sm">Pay Dues</a>
				{/if}
			</div>
		</div>
	</section>

	<section class="grid grid-cols-1 md:grid-cols-3 gap-4">
		<div class="card-elevated">
			<p class="text-xs uppercase tracking-wider text-mg-warmGray mb-1">Section</p>
			<p class="text-xl font-semibold text-mg-charcoal capitalize">{data.member.section ?? 'Not set'}</p>
		</div>
		<div class="card-elevated">
			<p class="text-xs uppercase tracking-wider text-mg-warmGray mb-1">Lot Number</p>
			<p class="text-xl font-semibold text-mg-charcoal">{data.member.lotNumber ?? '--'}</p>
		</div>
		<div class="card-elevated">
			<p class="text-xs uppercase tracking-wider text-mg-warmGray mb-1">Events Attended</p>
			<p class="text-xl font-semibold text-mg-charcoal">{data.eventsAttended}</p>
		</div>
	</section>

	<section class="card-elevated">
		<div class="flex items-center justify-between mb-3">
			<h2 class="font-display text-2xl text-mg-charcoal">Upcoming RSVPs</h2>
			<a href="/dashboard/events" class="text-sm text-mg-forest hover:underline">View all</a>
		</div>

		{#if data.upcomingRsvps.length === 0}
			<p class="text-mg-warmGray">No upcoming RSVPs yet. Browse <a href="/events" class="text-mg-forest hover:underline">community events</a> to join one.</p>
		{:else}
			<div class="space-y-3">
				{#each data.upcomingRsvps as rsvp}
					{@const currentStatus = getStatus(rsvp.eventId, rsvp.rsvpStatus)}
					<div class="border border-mg-stone rounded-lg p-4 bg-white">
						<div class="flex flex-wrap items-start justify-between gap-3">
							<div>
								<a href="/events/{rsvp.eventId}" class="text-lg font-semibold text-mg-charcoal hover:text-mg-forest no-underline">{rsvp.title}</a>
								<p class="text-sm text-mg-warmGray mt-1">{rsvp.date}{rsvp.time ? ` at ${rsvp.time}` : ''} {rsvp.location ? `· ${rsvp.location}` : ''}</p>
								<span class="badge badge-green mt-2">{EVENT_CATEGORY_LABELS[rsvp.eventCategory as EventCategory]}</span>
							</div>

							<div>
								{#if expandedRsvp === rsvp.eventId}
									<div class="flex gap-1 flex-wrap justify-end">
										<button
											class="px-3 py-1 rounded-full text-xs border border-green-300 bg-green-50 text-green-800"
											class:font-semibold={currentStatus === 'going'}
											disabled={rsvpLoading[rsvp.eventId]}
											onclick={() => {
												changeRsvp(rsvp.eventId, 'going');
												expandedRsvp = null;
											}}
										>Going</button>
										<button
											class="px-3 py-1 rounded-full text-xs border border-yellow-300 bg-yellow-50 text-yellow-800"
											class:font-semibold={currentStatus === 'maybe'}
											disabled={rsvpLoading[rsvp.eventId]}
											onclick={() => {
												changeRsvp(rsvp.eventId, 'maybe');
												expandedRsvp = null;
											}}
										>Maybe</button>
										<button
											class="px-3 py-1 rounded-full text-xs border border-red-300 bg-red-50 text-red-800"
											class:font-semibold={currentStatus === 'not_going'}
											disabled={rsvpLoading[rsvp.eventId]}
											onclick={() => {
												changeRsvp(rsvp.eventId, 'not_going');
												expandedRsvp = null;
											}}
										>Not Going</button>
									</div>
								{:else}
									<button
										type="button"
										class="px-3 py-1 rounded-full text-xs border border-mg-stone bg-mg-parchment text-mg-charcoal capitalize"
										onclick={() => toggleRsvpPicker(rsvp.eventId)}
										title="Change RSVP"
									>{formatStatus(currentStatus)}</button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>

	<section class="card-elevated">
		<h2 class="font-display text-2xl text-mg-charcoal mb-3">Recent Check-ins</h2>
		{#if data.recentCheckins.length === 0}
			<p class="text-mg-warmGray">No recent check-ins. Attend an event and scan the check-in QR code.</p>
		{:else}
			<div class="space-y-3">
				{#each data.recentCheckins as checkin}
					<div class="border border-mg-stone rounded-lg p-3 bg-white flex items-start justify-between gap-3">
						<div>
							<a href="/events/{checkin.eventId}" class="font-medium text-mg-charcoal hover:text-mg-forest no-underline">{checkin.title}</a>
							<p class="text-sm text-mg-warmGray mt-1">{checkin.date}</p>
						</div>
						<span class="badge badge-gray">{EVENT_CATEGORY_LABELS[checkin.eventCategory as EventCategory]}</span>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
