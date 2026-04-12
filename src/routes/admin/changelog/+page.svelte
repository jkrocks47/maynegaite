<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const ENTITY_LABELS: Record<string, string> = {
		violation: 'Violation',
		architectural_request: 'Architectural Request',
		page_content: 'Site Content',
		event: 'Event',
		member: 'Member',
		announcement: 'Announcement',
		document: 'Document',
		officer: 'Officer',
		property: 'Property',
		gallery_image: 'Gallery Image'
	};

	const ACTION_LABELS: Record<string, string> = {
		create: 'Created',
		update: 'Updated',
		delete: 'Deleted',
		status_change: 'Status Changed',
		review: 'Reviewed'
	};

	const ACTION_COLORS: Record<string, string> = {
		create: 'badge-create',
		update: 'badge-update',
		delete: 'badge-delete',
		status_change: 'badge-status',
		review: 'badge-review'
	};

	function actorName(log: typeof data.logs[0]): string {
		if (log.actorDisplayName) return log.actorDisplayName;
		if (log.actorFirstName || log.actorLastName) return `${log.actorFirstName ?? ''} ${log.actorLastName ?? ''}`.trim();
		if (log.actorEmail) return log.actorEmail;
		return 'System';
	}

	function formatDate(d: Date | string | null): string {
		if (!d) return '—';
		const date = typeof d === 'string' ? new Date(d) : d;
		return date.toLocaleString('en-US', {
			month: 'short', day: 'numeric', year: 'numeric',
			hour: 'numeric', minute: '2-digit', hour12: true
		});
	}

	let totalPages = $derived(Math.max(1, Math.ceil(data.total / data.pageSize)));

	function buildUrl(params: Record<string, string | number>) {
		const p = new URLSearchParams();
		if (params.page && params.page !== 1) p.set('page', String(params.page));
		if (params.entityType) p.set('entityType', String(params.entityType));
		if (params.action) p.set('action', String(params.action));
		const qs = p.toString();
		return `/admin/changelog${qs ? '?' + qs : ''}`;
	}

	let filterEntityType = $state(data.entityType);
	let filterAction = $state(data.action);
</script>

<div class="changelog-page">
	<div class="page-header">
		<h1>Changelog</h1>
		<p class="subtitle">A complete record of all administrative actions taken in the system.</p>
	</div>

	<!-- Filters -->
	<form method="GET" class="filters">
		<div class="filter-group">
			<label for="entityType">Type</label>
			<select id="entityType" name="entityType" bind:value={filterEntityType}>
				<option value="">All Types</option>
				{#each Object.entries(ENTITY_LABELS) as [val, label]}
					<option value={val}>{label}</option>
				{/each}
			</select>
		</div>
		<div class="filter-group">
			<label for="action">Action</label>
			<select id="action" name="action" bind:value={filterAction}>
				<option value="">All Actions</option>
				{#each Object.entries(ACTION_LABELS) as [val, label]}
					<option value={val}>{label}</option>
				{/each}
			</select>
		</div>
		<button type="submit" class="filter-btn">Apply</button>
		<a href="/admin/changelog" class="clear-btn">Clear</a>
	</form>

	<!-- Results summary -->
	<div class="results-meta">
		{data.total} {data.total === 1 ? 'entry' : 'entries'}
		{#if data.entityType || data.action}
			<span class="filter-tag">
				{data.entityType ? ENTITY_LABELS[data.entityType] ?? data.entityType : ''}
				{data.entityType && data.action ? ' · ' : ''}
				{data.action ? ACTION_LABELS[data.action] ?? data.action : ''}
			</span>
		{/if}
	</div>

	<!-- Table -->
	{#if data.logs.length === 0}
		<div class="empty-state">No changelog entries found.</div>
	{:else}
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Date &amp; Time</th>
						<th>Actor</th>
						<th>Type</th>
						<th>Action</th>
						<th>Details</th>
					</tr>
				</thead>
				<tbody>
					{#each data.logs as log}
						<tr>
							<td class="cell-date">{formatDate(log.createdAt)}</td>
							<td class="cell-actor">{actorName(log)}</td>
							<td class="cell-entity">
								<span class="entity-tag">
									{ENTITY_LABELS[log.entityType] ?? log.entityType}
								</span>
							</td>
							<td class="cell-action">
								<span class="badge {ACTION_COLORS[log.action] ?? 'badge-update'}">
									{ACTION_LABELS[log.action] ?? log.action}
								</span>
							</td>
							<td class="cell-details">{log.details ?? '—'}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="pagination">
				{#if data.page > 1}
					<a href={buildUrl({ page: data.page - 1, entityType: data.entityType, action: data.action })} class="page-btn">← Prev</a>
				{:else}
					<span class="page-btn disabled">← Prev</span>
				{/if}

				<span class="page-info">Page {data.page} of {totalPages}</span>

				{#if data.page < totalPages}
					<a href={buildUrl({ page: data.page + 1, entityType: data.entityType, action: data.action })} class="page-btn">Next →</a>
				{:else}
					<span class="page-btn disabled">Next →</span>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<style>
	.changelog-page { max-width: 1100px; }

	.page-header { margin-bottom: 1.5rem; }
	.page-header h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.75rem; font-weight: 700; color: #1B4332; margin: 0 0 0.25rem; }
	.subtitle { font-size: 0.875rem; color: #6b7280; margin: 0; }

	/* Filters */
	.filters { display: flex; align-items: flex-end; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; }
	.filter-group { display: flex; flex-direction: column; gap: 0.25rem; }
	.filter-group label { font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
	.filter-group select { border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.4rem 0.75rem; font-size: 0.875rem; color: #374151; background: #fff; cursor: pointer; }
	.filter-btn { background: #1B4332; color: #fff; border: none; border-radius: 0.375rem; padding: 0.45rem 1rem; font-size: 0.875rem; cursor: pointer; transition: background 0.15s; align-self: flex-end; }
	.filter-btn:hover { background: #14532d; }
	.clear-btn { color: #6b7280; font-size: 0.875rem; text-decoration: none; align-self: flex-end; padding: 0.45rem 0; }
	.clear-btn:hover { color: #374151; }

	/* Meta */
	.results-meta { font-size: 0.8rem; color: #9ca3af; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
	.filter-tag { background: #f3f4f6; color: #374151; border-radius: 0.25rem; padding: 0.1rem 0.5rem; font-size: 0.75rem; }

	/* Table */
	.table-wrapper { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; }
	table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
	thead { background: #f9fafb; }
	th { text-align: left; padding: 0.75rem 1rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
	td { padding: 0.7rem 1rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; }
	tr:last-child td { border-bottom: none; }
	tr:hover td { background: #f9fafb; }

	.cell-date { color: #6b7280; white-space: nowrap; font-size: 0.8rem; }
	.cell-actor { font-weight: 500; color: #374151; white-space: nowrap; }
	.cell-entity { white-space: nowrap; }
	.cell-details { color: #6b7280; max-width: 300px; }

	.entity-tag { background: #eff6ff; color: #1d4ed8; border-radius: 0.25rem; padding: 0.15rem 0.5rem; font-size: 0.75rem; font-weight: 500; white-space: nowrap; }

	/* Action badges */
	.badge { display: inline-block; border-radius: 0.25rem; padding: 0.15rem 0.6rem; font-size: 0.72rem; font-weight: 600; white-space: nowrap; }
	.badge-create { background: #dcfce7; color: #166534; }
	.badge-update { background: #fef9c3; color: #854d0e; }
	.badge-delete { background: #fee2e2; color: #991b1b; }
	.badge-status { background: #ede9fe; color: #5b21b6; }
	.badge-review { background: #e0f2fe; color: #0369a1; }

	/* Empty */
	.empty-state { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 3rem; text-align: center; color: #9ca3af; font-size: 0.875rem; }

	/* Pagination */
	.pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.25rem; }
	.page-btn { border: 1px solid #d1d5db; border-radius: 0.375rem; padding: 0.4rem 0.9rem; font-size: 0.875rem; color: #374151; text-decoration: none; background: #fff; transition: background 0.15s; }
	.page-btn:hover:not(.disabled) { background: #f3f4f6; }
	.page-btn.disabled { color: #d1d5db; cursor: default; pointer-events: none; }
	.page-info { font-size: 0.875rem; color: #6b7280; }
</style>
