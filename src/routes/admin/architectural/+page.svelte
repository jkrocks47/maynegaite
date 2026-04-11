<script lang="ts">
	import { enhance } from '$app/forms';
	import SearchableSelect from '$lib/components/shared/SearchableSelect.svelte';

	let { data, form } = $props();
	let editingId = $state<string | null>(null);
	let reviewingId = $state<string | null>(null);
	let showingLogsId = $state<string | null>(null);

	let memberSelectOptions = $derived([
		{ value: '', label: 'Select member' },
		...data.memberOptions.map(m => ({ value: m.id, label: `${m.label} (${m.email})` }))
	]);

	let propertySelectOptions = $derived([
		{ value: '', label: 'Unspecified' },
		...data.propertyOptions.map(p => ({ value: p.id, label: `Lot ${p.lotNumber}${p.address ? ` - ${p.address}` : ''}` }))
	]);

	const requestTypeLabels: Record<string, string> = {
		modification: 'Modification',
		new_construction: 'New Construction',
		fence: 'Fence',
		landscaping: 'Landscaping',
		paint: 'Paint',
		other: 'Other'
	};

	const statusLabels: Record<string, string> = {
		submitted: 'Submitted',
		under_review: 'Under Review',
		approved: 'Approved',
		denied: 'Denied',
		revision_requested: 'Revision Requested'
	};

	function formatDate(value: string | Date | null): string {
		if (!value) return '--';
		const date = value instanceof Date ? value : new Date(value);
		if (Number.isNaN(date.getTime())) return '--';
		return date.toLocaleString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function statusClass(status: string): string {
		switch (status) {
			case 'approved':
				return 'bg-green-100 text-green-700 border border-green-200';
			case 'denied':
				return 'bg-red-100 text-red-700 border border-red-200';
			case 'revision_requested':
				return 'bg-amber-100 text-amber-700 border border-amber-200';
			case 'under_review':
				return 'bg-blue-100 text-blue-700 border border-blue-200';
			default:
				return 'bg-mg-parchment text-mg-charcoal border border-mg-stone';
		}
	}

	function attachmentsText(attachments: string[] | null | undefined): string {
		return attachments?.join('\n') ?? '';
	}
</script>

<svelte:head>
	<title>Architectural Requests - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-7xl">
	<h1 class="text-2xl font-bold text-mg-charcoal mb-6">Architectural Request Review</h1>

	<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Submitted</p>
			<p class="text-2xl font-semibold text-mg-charcoal">{data.statusCounts.submitted}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Under Review</p>
			<p class="text-2xl font-semibold text-mg-charcoal">{data.statusCounts.under_review}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Approved</p>
			<p class="text-2xl font-semibold text-green-700">{data.statusCounts.approved}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Denied</p>
			<p class="text-2xl font-semibold text-red-700">{data.statusCounts.denied}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Revision Requested</p>
			<p class="text-2xl font-semibold text-amber-700">{data.statusCounts.revision_requested}</p>
		</div>
	</div>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Architectural request updated.</div>
	{/if}

	<section class="card-elevated mb-6">
		<h2 class="text-lg font-semibold text-mg-charcoal mb-3">Create Request</h2>
		<form method="POST" action="?/create" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="create-memberId" class="block text-sm font-medium text-mg-charcoal mb-1">Requester *</label>
				<SearchableSelect id="create-memberId" name="memberId" required options={memberSelectOptions} />
			</div>
			<div>
				<label for="create-propertyId" class="block text-sm font-medium text-mg-charcoal mb-1">Property (optional)</label>
				<SearchableSelect id="create-propertyId" name="propertyId" options={propertySelectOptions} />
			</div>
			<div>
				<label for="create-title" class="block text-sm font-medium text-mg-charcoal mb-1">Title *</label>
				<input id="create-title" name="title" class="input" required />
			</div>
			<div>
				<label for="create-requestType" class="block text-sm font-medium text-mg-charcoal mb-1">Type *</label>
				<select id="create-requestType" name="requestType" class="input">
					{#each data.requestTypes as requestType}
						<option value={requestType}>{requestTypeLabels[requestType] ?? requestType}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<label for="create-description" class="block text-sm font-medium text-mg-charcoal mb-1">Description *</label>
				<textarea id="create-description" name="description" rows="3" class="input" required></textarea>
			</div>
			<div class="md:col-span-2">
				<label for="create-attachments" class="block text-sm font-medium text-mg-charcoal mb-1">Attachments (URLs, one per line)</label>
				<textarea id="create-attachments" name="attachments" rows="2" class="input" placeholder="https://...\nhttps://..."></textarea>
			</div>
			<div class="md:col-span-2">
				<button type="submit" class="btn-primary">Create Request</button>
			</div>
		</form>
	</section>

	<section class="card-elevated overflow-x-auto">
		{#if data.requests.length === 0}
			<p class="text-mg-warmGray">No architectural requests yet.</p>
		{:else}
			<table class="w-full border-collapse min-w-[1200px]">
				<thead>
					<tr>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Title</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Requester</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Lot</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Type</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Status</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Submitted</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Reviewed</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.requests as request}
						<tr class="border-b border-mg-stone/70 align-top">
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								<div class="font-medium">{request.title}</div>
								<div class="text-xs text-mg-warmGray mt-1 line-clamp-2">{request.description}</div>
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{request.requesterName}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{request.lotNumber ? `Lot ${request.lotNumber}` : '--'}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{requestTypeLabels[request.requestType] ?? request.requestType}</td>
							<td class="px-3 py-3">
								<span class={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusClass(request.status)}`}>
									{statusLabels[request.status] ?? request.status}
								</span>
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{formatDate(request.submittedAt)}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								{#if request.reviewedAt}
									<div>{formatDate(request.reviewedAt)}</div>
									{#if request.reviewerName}
										<div class="text-xs text-mg-warmGray">{request.reviewerName}</div>
									{/if}
								{:else}
									--
								{/if}
							</td>
							<td class="px-3 py-3">
								<div class="flex gap-2 flex-wrap">
									<button
										type="button"
										class="btn-secondary text-xs"
										onclick={() => {
											editingId = editingId === request.id ? null : request.id;
											reviewingId = null;
											showingLogsId = null;
										}}
									>Edit</button>
									<button
										type="button"
										class="btn-secondary text-xs"
										onclick={() => {
											reviewingId = reviewingId === request.id ? null : request.id;
											editingId = null;
											showingLogsId = null;
										}}
									>Review</button>
									<button
										type="button"
										class="btn-secondary text-xs"
										onclick={() => {
											showingLogsId = showingLogsId === request.id ? null : request.id;
											editingId = null;
											reviewingId = null;
										}}
									>History</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={request.id} />
										<button
											type="submit"
											class="text-xs text-red-600 hover:underline"
											onclick={(event) => {
												if (!confirm('Delete this architectural request?')) event.preventDefault();
											}}
										>Delete</button>
									</form>
								</div>
							</td>
						</tr>

						{#if reviewingId === request.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="8" class="px-3 py-4 bg-mg-parchment/40">
									<form method="POST" action="?/review" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input type="hidden" name="id" value={request.id} />
										<div>
											<label for={`review-status-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Status</label>
											<select id={`review-status-${request.id}`} name="status" class="input">
												{#each data.statuses as status}
													<option value={status} selected={request.status === status}>{statusLabels[status] ?? status}</option>
												{/each}
											</select>
										</div>
										<div class="md:col-span-2">
											<label for={`review-notes-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Review Notes</label>
											<textarea id={`review-notes-${request.id}`} name="reviewNotes" rows="3" class="input">{request.reviewNotes || ''}</textarea>
											<p class="text-xs text-mg-warmGray mt-1">Saving review sets reviewer and timestamp automatically.</p>
										</div>
										<div class="md:col-span-2 flex gap-2">
											<button type="submit" class="btn-primary text-sm">Save Review</button>
											<button type="button" class="btn-secondary text-sm" onclick={() => (reviewingId = null)}>Cancel</button>
										</div>
									</form>
								</td>
							</tr>
						{/if}

						{#if editingId === request.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="8" class="px-3 py-4 bg-mg-parchment/40">
									<form method="POST" action="?/update" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input type="hidden" name="id" value={request.id} />
										<div>
											<label for={`edit-member-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Requester *</label>
											<SearchableSelect id={`edit-member-${request.id}`} name="memberId" required value={request.memberId || ''} options={memberSelectOptions} />
										</div>
										<div>
											<label for={`edit-property-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Property</label>
											<SearchableSelect id={`edit-property-${request.id}`} name="propertyId" value={request.propertyId || ''} options={propertySelectOptions} />
										</div>
										<div>
											<label for={`edit-title-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Title *</label>
											<input id={`edit-title-${request.id}`} name="title" class="input" required value={request.title} />
										</div>
										<div>
											<label for={`edit-type-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Type *</label>
											<select id={`edit-type-${request.id}`} name="requestType" class="input">
												{#each data.requestTypes as requestType}
													<option value={requestType} selected={request.requestType === requestType}>{requestTypeLabels[requestType] ?? requestType}</option>
												{/each}
											</select>
										</div>
										<div class="md:col-span-2">
											<label for={`edit-description-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Description *</label>
											<textarea id={`edit-description-${request.id}`} name="description" rows="3" class="input" required>{request.description}</textarea>
										</div>
										<div class="md:col-span-2">
											<label for={`edit-attachments-${request.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Attachments (URLs, one per line)</label>
											<textarea id={`edit-attachments-${request.id}`} name="attachments" rows="2" class="input">{attachmentsText(request.attachments)}</textarea>
										</div>
										<div class="md:col-span-2 flex gap-2">
											<button type="submit" class="btn-primary text-sm">Save Changes</button>
											<button type="button" class="btn-secondary text-sm" onclick={() => (editingId = null)}>Cancel</button>
										</div>
									</form>
								</td>
							</tr>
						{/if}

						{#if showingLogsId === request.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="8" class="px-3 py-4 bg-mg-parchment/40">
									<h3 class="text-sm font-semibold text-mg-charcoal mb-3">Activity History</h3>
									{#if request.logs && request.logs.length > 0}
										<ul class="space-y-3">
											{#each request.logs as log}
												<li class="text-sm">
													<span class="font-medium text-mg-charcoal">{log.actorName}</span>
													<span class="text-mg-warmGray mx-1">•</span>
													<span class="text-mg-charcoal capitalize">
														{#if log.action === 'status_change'}
															Status Change
														{:else}
															{log.action}
														{/if}
													</span>
													{#if log.details}
														<span class="text-mg-charcoal mx-1">-</span>
														<span class="text-mg-charcoal">{log.details}</span>
													{/if}
													<span class="text-mg-warmGray mx-1">•</span>
													<span class="text-xs text-mg-warmGray">{formatDate(log.createdAt)}</span>
												</li>
											{/each}
										</ul>
									{:else}
										<p class="text-sm text-mg-warmGray">No activity recorded.</p>
									{/if}
									<div class="mt-4">
										<button type="button" class="btn-secondary text-sm" onclick={() => (showingLogsId = null)}>Close Details</button>
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>
