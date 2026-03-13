<script lang="ts">
	import { getCalendarDays, isToday, formatShortDate } from '$lib/utils/dates';

	interface CalendarEvent {
		id: string;
		title: string;
		date: string;
		time: string | null;
		location: string | null;
		clubType: string;
		imageUrl: string | null;
	}

	let { events = [] }: { events: CalendarEvent[] } = $props();

	let now = new Date();
	let currentYear = $state(now.getFullYear());
	let currentMonth = $state(now.getMonth());
	let selectedDay = $state<number | null>(null);
	let activeFilter = $state<'all' | 'astronomy' | 'physics'>('all');

	let days = $derived(getCalendarDays(currentYear, currentMonth));

	let monthLabel = $derived(
		new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);

	// Map of day numbers that have events this month
	let eventDayMap = $derived.by(() => {
		const map = new Map<number, { astronomy: boolean; physics: boolean }>();
		for (const ev of events) {
			const d = new Date(ev.date + 'T00:00:00');
			if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
				const day = d.getDate();
				const existing = map.get(day) || { astronomy: false, physics: false };
				if (ev.clubType === 'astronomy') existing.astronomy = true;
				if (ev.clubType === 'physics') existing.physics = true;
				map.set(day, existing);
			}
		}
		return map;
	});

	// Filtered events for the list
	let filteredEvents = $derived.by(() => {
		let filtered = events;

		if (activeFilter !== 'all') {
			filtered = filtered.filter((e) => e.clubType === activeFilter);
		}

		if (selectedDay !== null) {
			filtered = filtered.filter((e) => {
				const d = new Date(e.date + 'T00:00:00');
				return (
					d.getFullYear() === currentYear &&
					d.getMonth() === currentMonth &&
					d.getDate() === selectedDay
				);
			});
		}

		return filtered;
	});

	function prevMonth() {
		if (currentMonth === 0) {
			currentMonth = 11;
			currentYear--;
		} else {
			currentMonth--;
		}
		selectedDay = null;
	}

	function nextMonth() {
		if (currentMonth === 11) {
			currentMonth = 0;
			currentYear++;
		} else {
			currentMonth++;
		}
		selectedDay = null;
	}

	function selectDay(day: number) {
		if (selectedDay === day) {
			selectedDay = null;
		} else {
			selectedDay = day;
		}
	}

	const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
</script>

<section class="calendar-section">
	<!-- Accent bar -->
	<div class="accent-bar"></div>

	<h2 class="section-title">Upcoming Events</h2>

	<!-- Filter pills -->
	<div class="filter-row">
		<button
			class="filter-pill"
			class:active={activeFilter === 'all'}
			onclick={() => (activeFilter = 'all')}
		>
			All
		</button>
		<button
			class="filter-pill"
			class:active={activeFilter === 'astronomy'}
			onclick={() => (activeFilter = 'astronomy')}
		>
			Astronomy
		</button>
		<button
			class="filter-pill"
			class:active={activeFilter === 'physics'}
			onclick={() => (activeFilter = 'physics')}
		>
			Physics
		</button>
	</div>

	<div class="calendar-layout">
		<!-- Mini calendar grid -->
		<div class="calendar-grid-wrapper">
			<div class="calendar-nav">
				<button onclick={prevMonth} aria-label="Previous month">&larr;</button>
				<span class="month-label">{monthLabel}</span>
				<button onclick={nextMonth} aria-label="Next month">&rarr;</button>
			</div>

			<div class="weekday-row">
				{#each weekdays as wd}
					<span class="weekday-cell">{wd}</span>
				{/each}
			</div>

			<div class="days-grid">
				{#each days as day}
					{#if day === null}
						<span class="day-cell empty"></span>
					{:else}
						{@const hasEvents = eventDayMap.has(day)}
						{@const todayCheck = isToday(new Date(currentYear, currentMonth, day))}
						<button
							class="day-cell"
							class:today={todayCheck}
							class:has-events={hasEvents}
							class:selected={selectedDay === day}
							onclick={() => selectDay(day)}
							aria-label="{day}{hasEvents ? ' (has events)' : ''}"
						>
							<span class="day-number">{day}</span>
							{#if hasEvents}
								{@const info = eventDayMap.get(day)!}
								<span class="event-dots">
									{#if info.astronomy}
										<span class="dot dot-astro"></span>
									{/if}
									{#if info.physics}
										<span class="dot dot-phys"></span>
									{/if}
								</span>
							{/if}
						</button>
					{/if}
				{/each}
			</div>
		</div>

		<!-- Event list -->
		<div class="event-list">
			{#if filteredEvents.length === 0}
				<div class="empty-state">
					<p>No upcoming events</p>
				</div>
			{:else}
				{#each filteredEvents as event}
					{@const shortDate = formatShortDate(event.date)}
					<div class="event-card">
						<div class="event-date-badge">
							<span class="event-month">{shortDate.month}</span>
							<span class="event-day">{shortDate.day}</span>
						</div>
						<div class="event-info">
							<span class="club-badge" class:astronomy={event.clubType === 'astronomy'} class:physics={event.clubType === 'physics'}>
								{event.clubType === 'astronomy' ? 'ASTRO' : 'PHYS'}
							</span>
							<h3 class="event-title">{event.title}</h3>
							{#if event.time || event.location}
								<p class="event-meta">
									{#if event.time}{event.time}{/if}
									{#if event.time && event.location} · {/if}
									{#if event.location}{event.location}{/if}
								</p>
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</div>
	</div>
</section>

<style>
	.calendar-section {
		max-width: 72rem;
		margin: 0 auto;
		padding: 1rem 2rem 5rem;
	}

	.accent-bar {
		width: 120px;
		height: 3px;
		background: linear-gradient(90deg, #CE1126, #0d1b2a);
		margin-bottom: 1rem;
		border-radius: 2px;
	}

	.section-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 2.5rem;
		font-weight: 700;
		color: #f5f0e8;
		letter-spacing: 0.05em;
		margin-bottom: 0.5rem;
	}

	.filter-row {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.filter-pill {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.4rem 1rem;
		border-radius: 9999px;
		border: 1px solid rgba(245, 240, 232, 0.15);
		background: transparent;
		color: #8892A4;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.filter-pill:hover {
		border-color: rgba(206, 17, 38, 0.4);
		color: #f5f0e8;
	}

	.filter-pill.active {
		background: rgba(206, 17, 38, 0.15);
		border-color: #CE1126;
		color: #f5f0e8;
	}

	.calendar-layout {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2.5rem;
		align-items: start;
	}

	/* Calendar grid */
	.calendar-grid-wrapper {
		background: rgba(13, 27, 42, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(245, 240, 232, 0.08);
		border-radius: 16px;
		padding: 1.75rem;
	}

	.calendar-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}

	.calendar-nav button {
		background: none;
		border: none;
		color: #8892A4;
		font-size: 1rem;
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: color 0.2s ease;
	}

	.calendar-nav button:hover {
		color: #f5f0e8;
	}

	.month-label {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #f5f0e8;
		letter-spacing: 0.05em;
	}

	.weekday-row {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
		margin-bottom: 4px;
	}

	.weekday-cell {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.7rem;
		color: #8892A4;
		text-align: center;
		padding: 0.35rem 0;
		letter-spacing: 0.05em;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.day-cell {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		border: none;
		background: transparent;
		cursor: pointer;
		position: relative;
		padding: 2px;
		transition: background 0.15s ease;
	}

	.day-cell.empty {
		cursor: default;
	}

	.day-number {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.9rem;
		color: rgba(245, 240, 232, 0.6);
		line-height: 1;
	}

	.day-cell:not(.empty):hover {
		background: rgba(245, 240, 232, 0.06);
	}

	.day-cell.today {
		box-shadow: inset 0 0 0 1.5px #CE1126;
	}

	.day-cell.today .day-number {
		color: #CE1126;
		font-weight: 700;
	}

	.day-cell.selected {
		background: rgba(206, 17, 38, 0.2);
	}

	.day-cell.selected .day-number {
		color: #f5f0e8;
	}

	.day-cell.has-events .day-number {
		color: #f5f0e8;
	}

	.event-dots {
		display: flex;
		gap: 2px;
		margin-top: 2px;
	}

	.dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
	}

	.dot-astro {
		background: #a855f7;
	}

	.dot-phys {
		background: #CE1126;
	}

	/* Event list */
	.event-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 120px;
	}

	.empty-state p {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.8rem;
		color: #8892A4;
		letter-spacing: 0.05em;
	}

	.event-card {
		display: flex;
		gap: 1.25rem;
		padding: 1.25rem;
		background: rgba(13, 27, 42, 0.6);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(245, 240, 232, 0.08);
		border-left: 3px solid #CE1126;
		border-radius: 12px;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.event-card:hover {
		border-color: rgba(245, 240, 232, 0.15);
		border-left-color: #E63946;
		box-shadow: 0 0 20px rgba(206, 17, 38, 0.1);
	}

	.event-date-badge {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 56px;
		padding: 0.6rem 0.75rem;
		background: rgba(206, 17, 38, 0.1);
		border-radius: 8px;
	}

	.event-month {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.65rem;
		color: #CE1126;
		letter-spacing: 0.1em;
		font-weight: 600;
	}

	.event-day {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #f5f0e8;
		line-height: 1.2;
	}

	.event-info {
		flex: 1;
		min-width: 0;
	}

	.club-badge {
		display: inline-block;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.55rem;
		letter-spacing: 0.15em;
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
		font-weight: 600;
		margin-bottom: 0.35rem;
	}

	.club-badge.astronomy {
		background: rgba(168, 85, 247, 0.15);
		color: #c4b5fd;
	}

	.club-badge.physics {
		background: rgba(206, 17, 38, 0.15);
		color: #E63946;
	}

	.event-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.1rem;
		font-weight: 600;
		color: #f5f0e8;
		margin-bottom: 0.3rem;
	}

	.event-meta {
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		color: #8892A4;
		letter-spacing: 0.03em;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.calendar-section {
			padding: 3rem 1.25rem 4rem;
		}

		.calendar-layout {
			grid-template-columns: 1fr;
		}

		.section-title {
			font-size: 1.8rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.filter-pill,
		.event-card,
		.day-cell,
		.calendar-nav button {
			transition: none;
		}
	}
</style>
