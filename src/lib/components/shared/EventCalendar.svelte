<script lang="ts">
	import { getCalendarDays, isToday } from '$lib/utils/dates';
	import RSVPButtons from '$lib/components/shared/RSVPButtons.svelte';
	import { EVENT_CATEGORY_LABELS } from '$lib/utils/constants';
	import type { EventCategory } from '$lib/utils/constants';

	interface CalendarEvent {
		id: string;
		title: string;
		description: string | null;
		date: string;
		time: string | null;
		location: string | null;
		eventCategory: string;
		imageUrl: string | null;
	}

	let {
		events = [],
		isLoggedIn = false,
		isVerified = false
	}: {
		events: CalendarEvent[];
		isLoggedIn?: boolean;
		isVerified?: boolean;
	} = $props();

	let now = new Date();
	let currentYear = $state(now.getFullYear());
	let currentMonth = $state(now.getMonth());
	let selectedDay = $state<number | null>(null);

	let days = $derived(getCalendarDays(currentYear, currentMonth));

	let monthLabel = $derived(
		new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);

	let eventDayMap = $derived.by(() => {
		const map = new Map<number, boolean>();
		for (const ev of events) {
			const d = new Date(ev.date + 'T00:00:00');
			if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
				map.set(d.getDate(), true);
			}
		}
		return map;
	});

	let filteredEvents = $derived.by(() => {
		let filtered = events;
		if (selectedDay !== null) {
			filtered = filtered.filter((e) => {
				const d = new Date(e.date + 'T00:00:00');
				return d.getFullYear() === currentYear && d.getMonth() === currentMonth && d.getDate() === selectedDay;
			});
		}
		return filtered;
	});

	function prevMonth() {
		if (currentMonth === 0) { currentMonth = 11; currentYear--; }
		else { currentMonth--; }
		selectedDay = null;
	}

	function nextMonth() {
		if (currentMonth === 11) { currentMonth = 0; currentYear++; }
		else { currentMonth++; }
		selectedDay = null;
	}

	function selectDay(day: number) {
		selectedDay = selectedDay === day ? null : day;
	}

	function truncate(text: string | null, max: number): string {
		if (!text) return '';
		return text.length > max ? text.slice(0, max).trimEnd() + '...' : text;
	}

	function getCategoryLabel(cat: string): string {
		return EVENT_CATEGORY_LABELS[cat as EventCategory] ?? cat;
	}

	const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
</script>

<section class="max-w-5xl mx-auto">
	<div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
		<!-- Calendar grid -->
		<div class="card-elevated">
			<div class="flex items-center justify-between mb-4">
				<button onclick={prevMonth} aria-label="Previous month" class="text-mg-warmGray hover:text-mg-charcoal px-2 py-1 rounded transition-colors">&larr;</button>
				<span class="font-display text-lg font-semibold text-mg-charcoal">{monthLabel}</span>
				<button onclick={nextMonth} aria-label="Next month" class="text-mg-warmGray hover:text-mg-charcoal px-2 py-1 rounded transition-colors">&rarr;</button>
			</div>

			<div class="grid grid-cols-7 gap-0.5 mb-1">
				{#each weekdays as wd}
					<span class="text-center text-xs font-ui text-mg-warmGray py-1">{wd}</span>
				{/each}
			</div>

			<div class="grid grid-cols-7 gap-1">
				{#each days as day}
					{#if day === null}
						<span class="aspect-square"></span>
					{:else}
						{@const hasEvent = eventDayMap.get(day) ?? false}
						{@const todayCheck = isToday(new Date(currentYear, currentMonth, day))}
						<button
							class="aspect-square flex items-center justify-center rounded-lg transition-all text-sm
								{todayCheck ? 'ring-2 ring-mg-forest font-bold text-mg-forest' : ''}
								{hasEvent ? 'bg-mg-forest/10 text-mg-forest font-medium' : 'text-mg-warmGray hover:bg-mg-parchment'}
								{selectedDay === day ? 'bg-mg-forest text-white font-bold' : ''}"
							onclick={() => selectDay(day)}
							aria-label="{day}{hasEvent ? ' (has events)' : ''}"
						>
							{day}
						</button>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Event detail panel -->
		<div class="flex flex-col gap-3 min-h-[200px] max-h-[500px] overflow-y-auto">
			{#if selectedDay !== null}
				<p class="text-sm font-semibold text-mg-warmGray border-b border-mg-stone pb-2">
					Events on {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
				</p>
			{:else}
				<p class="text-sm font-semibold text-mg-warmGray border-b border-mg-stone pb-2">Upcoming Events</p>
			{/if}

			{#if filteredEvents.length > 0}
				{#each filteredEvents as event}
					<div class="card-elevated hover-lift border-l-3 border-l-mg-forest">
						{#if event.imageUrl}
							<img src={event.imageUrl} alt="" class="w-full h-24 object-cover rounded-t-lg -mt-6 -mx-6 mb-3" style="width: calc(100% + 3rem);" />
						{/if}
						<div class="flex items-center justify-between mb-1">
							<span class="badge badge-green">{getCategoryLabel(event.eventCategory)}</span>
							{#if selectedDay === null}
								<span class="text-xs text-mg-warmGray">
									{new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
								</span>
							{/if}
						</div>
						<h3 class="font-semibold text-mg-charcoal mb-1">
							<a href="/events/{event.id}" class="hover:text-mg-forest transition-colors" data-sveltekit-preload-data="hover">
								{event.title}
							</a>
						</h3>
						{#if event.time || event.location}
							<p class="text-xs text-mg-warmGray mb-2">
								{#if event.time}{event.time}{/if}
								{#if event.time && event.location} · {/if}
								{#if event.location}{event.location}{/if}
							</p>
						{/if}
						{#if event.description}
							<p class="text-sm text-mg-warmGray mb-3">{truncate(event.description, 150)}</p>
						{/if}
						<div class="flex items-center justify-between flex-wrap gap-2">
							<RSVPButtons eventId={event.id} currentStatus={null} {isLoggedIn} {isVerified} redirectTo="/" />
							<a href="/events/{event.id}" class="text-xs text-mg-warmGray hover:text-mg-forest transition-colors">View details &rarr;</a>
						</div>
					</div>
				{/each}
			{:else}
				<div class="flex items-center justify-center min-h-[200px] card-subtle rounded-2xl">
					<p class="text-sm text-mg-warmGray">{selectedDay !== null ? 'No events on this day' : 'No upcoming events'}</p>
				</div>
			{/if}
		</div>
	</div>
</section>
