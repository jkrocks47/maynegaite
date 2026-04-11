<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editingId = $state<string | null>(null);

	const violationTypeLabels: Record<string, string> = {
		signage: 'Signage',
		architectural: 'Architectural',
		maintenance: 'Maintenance',
		noise: 'Noise',
		other: 'Other'
	};

	const statusLabels: Record<string, string> = {
		reported: 'Reported',
		investigating: 'Investigating',
		resolved: 'Resolved',
		dismissed: 'Dismissed'
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
			case 'resolved':
				return 'bg-green-100 text-green-700 border border-green-200';
			case 'dismissed':
				return 'bg-slate-100 text-slate-700 border border-slate-200';
			case 'investigating':
				return 'bg-blue-100 text-blue-700 border border-blue-200';
			default:
				return 'bg-amber-100 text-amber-700 border border-amber-200';
		}
	}
</script>

<svelte:head>
	<title>Violations - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-7xl">
	<h1 class="text-2xl font-bold text-mg-charcoal mb-6">Violation Tracking</h1>

	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Reported</p>
			<p class="text-2xl font-semibold text-mg-charcoal">{data.statusCounts.reported}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Investigating</p>
			<p class="text-2xl font-semibold text-mg-charcoal">{data.statusCounts.investigating}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Resolved</p>
			<p class="text-2xl font-semibold text-green-700">{data.statusCounts.resolved}</p>
		</div>
		<div class="card-subtle text-center">
			<p class="text-xs uppercase tracking-wide text-mg-warmGray">Dismissed</p>
			<p class="text-2xl font-semibold text-slate-700">{data.statusCounts.dismissed}</p>
		</div>
	</div>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Violation record updated.</div>
	{/if}

	<section class="card-elevated mb-6">
		<h2 class="text-lg font-semibold text-mg-charcoal mb-3">Report Violation</h2>
		<form method="POST" action="?/create" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="create-propertyId" class="block text-sm font-medium text-mg-charcoal mb-1">Property</label>
				<select id="create-propertyId" name="propertyId" class="input">
					<option value="">Unspecified</option>
					{#each data.propertyOptions as property}
						<option value={property.id}>Lot {property.lotNumber}{property.address ? ` - ${property.address}` : ''}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="create-reportedBy" class="block text-sm font-medium text-mg-charcoal mb-1">Reported By</label>
				<select id="create-reportedBy" name="reportedBy" class="input">
					<option value="">Current admin</option>
					{#each data.memberOptions as member}
						<option value={member.id}>{member.label} ({member.email})</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="create-violationType" class="block text-sm font-medium text-mg-charcoal mb-1">Violation Type *</label>
				<select id="create-violationType" name="violationType" class="input">
					{#each data.violationTypes as violationType}
						<option value={violationType}>{violationTypeLabels[violationType] ?? violationType}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="create-status" class="block text-sm font-medium text-mg-charcoal mb-1">Status</label>
				<select id="create-status" name="status" class="input">
					{#each data.statuses as status}
						<option value={status} selected={status === 'reported'}>{statusLabels[status] ?? status}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<label for="create-description" class="block text-sm font-medium text-mg-charcoal mb-1">Description *</label>
				<textarea id="create-description" name="description" rows="3" class="input" required></textarea>
			</div>
			<div class="md:col-span-2">
				<label for="create-notes" class="block text-sm font-medium text-mg-charcoal mb-1">Notes</label>
				<textarea id="create-notes" name="notes" rows="2" class="input"></textarea>
			</div>
			<div class="md:col-span-2">
				<button type="submit" class="btn-primary">Create Violation Record</button>
			</div>
		</form>
	</section>

	<section class="card-elevated overflow-x-auto">
		{#if data.records.length === 0}
			<p class="text-mg-warmGray">No violation records yet.</p>
		{:else}
			<table class="w-full border-collapse min-w-[1250px]">
				<thead>
					<tr>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Description</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Type</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Status</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Lot</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Reporter</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Reported</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Resolution</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.records as record}
						<tr class="border-b border-mg-stone/70 align-top">
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								<div class="line-clamp-2">{record.description}</div>
								{#if record.notes}
									<div class="text-xs text-mg-warmGray mt-1 line-clamp-2">Notes: {record.notes}</div>
								{/if}
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{violationTypeLabels[record.violationType] ?? record.violationType}</td>
							<td class="px-3 py-3">
								<span class={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusClass(record.status)}`}>
									{statusLabels[record.status] ?? record.status}
								</span>
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{record.lotNumber ? `Lot ${record.lotNumber}` : '--'}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{record.reporterName}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{formatDate(record.reportedAt)}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								{#if record.resolvedAt}
									<div>{formatDate(record.resolvedAt)}</div>
									{#if record.resolverName}
										<div class="text-xs text-mg-warmGray">{record.resolverName}</div>
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
											editingId = editingId === record.id ? null : record.id;
										}}
									>Edit</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={record.id} />
										<button
											type="submit"
											class="text-xs text-red-600 hover:underline"
											onclick={(event) => {
												if (!confirm('Delete this violation record?')) event.preventDefault();
											}}
										>Delete</button>
									</form>
								</div>
							</td>
						</tr>

						{#if editingId === record.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="8" class="px-3 py-4 bg-mg-parchment/40">
									<form method="POST" action="?/update" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input type="hidden" name="id" value={record.id} />
										<div>
											<label for={`edit-property-${record.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Property</label>
											<select id={`edit-property-${record.id}`} name="propertyId" class="input">
												<option value="" selected={!record.propertyId}>Unspecified</option>
												{#each data.propertyOptions as property}
													<option value={property.id} selected={record.propertyId === property.id}>Lot {property.lotNumber}{property.address ? ` - ${property.address}` : ''}</option>
												{/each}
											</select>
										</div>
										<div>
											<label for={`edit-reportedBy-${record.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Reported By</label>
											<select id={`edit-reportedBy-${record.id}`} name="reportedBy" class="input">
												<option value="" selected={!record.reportedBy}>Unspecified</option>
												{#each data.memberOptions as member}
													<option value={member.id} selected={record.reportedBy === member.id}>{member.label} ({member.email})</option>
												{/each}
											</select>
										</div>
										<div>
											<label for={`edit-violationType-${record.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Violation Type *</label>
											<select id={`edit-violationType-${record.id}`} name="violationType" class="input">
												{#each data.violationTypes as violationType}
													<option value={violationType} selected={record.violationType === violationType}>{violationTypeLabels[violationType] ?? violationType}</option>
												{/each}
											</select>
										</div>
										<div>
											<label for={`edit-status-${record.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Status</label>
											<select id={`edit-status-${record.id}`} name="status" class="input">
												{#each data.statuses as status}
													<option value={status} selected={record.status === status}>{statusLabels[status] ?? status}</option>
												{/each}
											</select>
										</div>
										<div class="md:col-span-2">
											<label for={`edit-description-${record.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Description *</label>
											<textarea id={`edit-description-${record.id}`} name="description" rows="3" class="input" required>{record.description}</textarea>
										</div>
										<div class="md:col-span-2">
											<label for={`edit-notes-${record.id}`} class="block text-sm font-medium text-mg-charcoal mb-1">Notes</label>
											<textarea id={`edit-notes-${record.id}`} name="notes" rows="2" class="input">{record.notes || ''}</textarea>
											<p class="text-xs text-mg-warmGray mt-1">Setting status to Resolved or Dismissed will stamp resolver and timestamp automatically.</p>
										</div>
										<div class="md:col-span-2 flex gap-2">
											<button type="submit" class="btn-primary text-sm">Save Changes</button>
											<button type="button" class="btn-secondary text-sm" onclick={() => (editingId = null)}>Cancel</button>
										</div>
									</form>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</section>
</div>
