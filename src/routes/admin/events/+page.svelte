<script lang="ts">
	import { enhance } from '$app/forms';
	import CheckinQuestionBuilder from '$lib/components/admin/CheckinQuestionBuilder.svelte';
	import {
		EVENT_CATEGORIES,
		EVENT_CATEGORY_LABELS
	} from '$lib/utils/constants';
	import type { CheckinQuestion } from '$lib/server/db/schema';

	let { data, form } = $props();

	let showCreate = $state(false);
	let editingId = $state<string | null>(null);
	let createQuestions = $state<CheckinQuestion[]>([]);
	let editQuestions = $state<CheckinQuestion[]>([]);
	let showingQr = $state<string | null>(null);

	function checkinPath(eventId: string, code: string | null) {
		if (!code) return '';
		return `/checkin/${eventId}?code=${code}`;
	}

	function qrUrl(path: string): string {
		const base = typeof window !== 'undefined' ? window.location.origin : '';
		return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(base + path)}`;
	}
</script>

<svelte:head>
	<title>Events - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-6xl">
	<div class="flex items-center justify-between gap-4 mb-6">
		<h1 class="text-2xl font-bold text-mg-charcoal">Event Management</h1>
		<button type="button" class="btn-primary text-sm" onclick={() => { showCreate = !showCreate; editingId = null; }}>
			{showCreate ? 'Cancel' : '+ New Event'}
		</button>
	</div>

	{#if data.historicalRate !== null}
		<div class="card-subtle mb-4 text-sm text-mg-charcoal">
			Historical turnout rate: <strong>{data.historicalRate}%</strong> of "going" RSVPs check in.
		</div>
	{/if}

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Changes saved.</div>
	{/if}

	{#if showCreate}
		<div class="card-elevated mb-6">
			<h2 class="text-lg font-semibold text-mg-charcoal mb-4">Create Event</h2>
			<form
				method="POST"
				action="?/create"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						showCreate = false;
					};
				}}
			>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="md:col-span-2">
						<label for="title" class="block text-sm font-medium text-mg-charcoal mb-1">Title *</label>
						<input id="title" name="title" required class="input" />
					</div>
					<div class="md:col-span-2">
						<label for="description" class="block text-sm font-medium text-mg-charcoal mb-1">Description</label>
						<textarea id="description" name="description" class="input" rows="4"></textarea>
					</div>
					<div>
						<label for="date" class="block text-sm font-medium text-mg-charcoal mb-1">Date *</label>
						<input id="date" type="date" name="date" required class="input" />
					</div>
					<div>
						<label for="time" class="block text-sm font-medium text-mg-charcoal mb-1">Time</label>
						<input id="time" name="time" class="input" placeholder="e.g., 6:30 PM" />
					</div>
					<div>
						<label for="location" class="block text-sm font-medium text-mg-charcoal mb-1">Location</label>
						<input id="location" name="location" class="input" />
					</div>
					<div>
						<label for="locationUrl" class="block text-sm font-medium text-mg-charcoal mb-1">Location URL</label>
						<input id="locationUrl" type="url" name="locationUrl" class="input" />
					</div>
					<div>
						<label for="eventCategory" class="block text-sm font-medium text-mg-charcoal mb-1">Category *</label>
						<select id="eventCategory" name="eventCategory" class="input">
							{#each EVENT_CATEGORIES as category}
								<option value={category}>{EVENT_CATEGORY_LABELS[category]}</option>
							{/each}
						</select>
					</div>
					<div>
						<label for="maxAttendees" class="block text-sm font-medium text-mg-charcoal mb-1">Max Attendees</label>
						<input id="maxAttendees" type="number" min="1" name="maxAttendees" class="input" />
					</div>
					<div class="md:col-span-2">
						<label for="image" class="block text-sm font-medium text-mg-charcoal mb-1">Image</label>
						<input id="image" type="file" name="image" accept="image/*" class="input" />
					</div>
					<div class="md:col-span-2">
						<label class="inline-flex items-center gap-2 text-sm text-mg-charcoal cursor-pointer">
							<input type="checkbox" name="isPublished" checked class="accent-mg-forest" />
							Publish immediately
						</label>
					</div>
				</div>

				<div class="mt-4">
					<CheckinQuestionBuilder bind:questions={createQuestions} />
				</div>

				<div class="mt-4">
					<button class="btn-primary" type="submit">Create Event</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="card-elevated overflow-x-auto">
		{#if data.events.length === 0}
			<p class="text-mg-warmGray">No events yet. Create your first event.</p>
		{:else}
			<table class="w-full border-collapse min-w-[900px]">
				<thead>
					<tr>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Title</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Date</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Category</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">RSVP</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Attendance</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Status</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.events as event}
						<tr class="border-b border-mg-stone/70 align-top">
							<td class="px-3 py-3">
								<a href="/admin/events/{event.id}" class="font-medium text-mg-forest hover:underline no-underline">{event.title}</a>
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{event.date}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{EVENT_CATEGORY_LABELS[event.eventCategory] ?? event.eventCategory}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								{event.rsvpCounts.going} going / {event.rsvpCounts.maybe} maybe<br />
								<span class="text-xs text-mg-warmGray">Est. turnout: {event.estimatedTurnout}</span>
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{event.attendanceCount}</td>
							<td class="px-3 py-3">
								<form method="POST" action="?/togglePublish" use:enhance>
									<input type="hidden" name="id" value={event.id} />
									<button
										type="submit"
										class="text-xs px-2 py-1 rounded-full border"
										class:bg-green-100={event.isPublished}
										class:text-green-700={event.isPublished}
										class:border-green-200={event.isPublished}
										class:bg-yellow-100={!event.isPublished}
										class:text-yellow-700={!event.isPublished}
										class:border-yellow-200={!event.isPublished}
									>{event.isPublished ? 'Published' : 'Draft'}</button>
								</form>
							</td>
							<td class="px-3 py-3">
								<div class="flex items-center gap-2 flex-wrap">
									<button
										type="button"
										class="btn-secondary text-xs"
										onclick={() => {
											if (editingId === event.id) {
												editingId = null;
											} else {
												editingId = event.id;
												editQuestions = event.checkinQuestions ? [...event.checkinQuestions] : [];
											}
										}}
									>Edit</button>
									<button type="button" class="btn-secondary text-xs" onclick={() => showingQr = showingQr === event.id ? null : event.id}>QR</button>
									<a href="/admin/poster/{event.id}" target="_blank" class="btn-secondary text-xs no-underline">Poster</a>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={event.id} />
										<button type="submit" class="text-xs text-red-600 hover:underline" onclick={(e) => {
											if (!confirm('Delete this event?')) e.preventDefault();
										}}>Delete</button>
									</form>
								</div>
							</td>
						</tr>

						{#if showingQr === event.id && event.checkinCode}
							<tr class="border-b border-mg-stone/70">
								<td colspan="7" class="px-3 py-3 bg-mg-parchment/50">
									<div class="flex flex-wrap items-center gap-4">
										<img src={qrUrl(checkinPath(event.id, event.checkinCode))} alt="Check-in QR" class="w-36 h-36 rounded border border-mg-stone bg-white p-2" />
										<div>
											<p class="text-sm font-medium text-mg-charcoal">Check-in URL</p>
											<code class="text-xs text-mg-warmGray">{checkinPath(event.id, event.checkinCode)}</code>
										</div>
									</div>
								</td>
							</tr>
						{/if}

						{#if editingId === event.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="7" class="px-3 py-4 bg-mg-parchment/40">
									<form
										method="POST"
										action="?/edit"
										enctype="multipart/form-data"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
												editingId = null;
											};
										}}
									>
										<input type="hidden" name="id" value={event.id} />
										<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div class="md:col-span-2">
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Title *</label>
												<input name="title" value={event.title} required class="input" />
											</div>
											<div class="md:col-span-2">
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Description</label>
												<textarea name="description" rows="3" class="input">{event.description || ''}</textarea>
											</div>
											<div>
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Date *</label>
												<input name="date" type="date" value={event.date} required class="input" />
											</div>
											<div>
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Time</label>
												<input name="time" value={event.time || ''} class="input" />
											</div>
											<div>
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Location</label>
												<input name="location" value={event.location || ''} class="input" />
											</div>
											<div>
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Location URL</label>
												<input name="locationUrl" value={event.locationUrl || ''} class="input" />
											</div>
											<div>
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Category</label>
												<select name="eventCategory" class="input">
													{#each EVENT_CATEGORIES as category}
														<option value={category} selected={event.eventCategory === category}>{EVENT_CATEGORY_LABELS[category]}</option>
													{/each}
												</select>
											</div>
											<div>
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Max Attendees</label>
												<input type="number" min="1" name="maxAttendees" value={event.maxAttendees || ''} class="input" />
											</div>
											<div class="md:col-span-2">
												<label class="block text-sm font-medium text-mg-charcoal mb-1">Replace Image</label>
												<input type="file" name="image" accept="image/*" class="input" />
												<label class="inline-flex items-center gap-2 mt-2 text-xs text-mg-charcoal cursor-pointer">
													<input type="checkbox" name="removeImage" class="accent-mg-forest" />
													Remove existing image
												</label>
											</div>
											<div class="md:col-span-2">
												<label class="inline-flex items-center gap-2 text-sm text-mg-charcoal cursor-pointer">
													<input type="checkbox" name="isPublished" checked={event.isPublished} class="accent-mg-forest" />
													Published
												</label>
											</div>
										</div>

										<div class="mt-4">
											<CheckinQuestionBuilder bind:questions={editQuestions} />
										</div>

										<div class="mt-4 flex gap-2">
											<button class="btn-primary" type="submit">Save Changes</button>
											<button class="btn-secondary" type="button" onclick={() => (editingId = null)}>Cancel</button>
										</div>
									</form>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
