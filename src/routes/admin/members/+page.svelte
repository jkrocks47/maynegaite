<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ADMIN_ROLE_LABELS, getAssignableRoles } from '$lib/utils/constants';
	import type { AdminRole } from '$lib/utils/constants';

	let { data, form } = $props();

	let search = $state(data.search);
	const assignableRoles = $derived(getAssignableRoles(data.currentUserRole as AdminRole | null));

	function handleSearch() {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (data.sectionFilter) params.set('section', data.sectionFilter);
		if (data.roleFilter) params.set('role', data.roleFilter);
		goto(`/admin/members?${params.toString()}`);
	}

	function handleExport() {
		if (form?.csv) {
			const blob = new Blob([form.csv], { type: 'text/csv' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'members.csv';
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	$effect(() => {
		if (form?.csv) handleExport();
	});
</script>

<svelte:head>
	<title>Members - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-[1100px]">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-xl font-bold text-gray-800">Members ({data.totalCount})</h1>
		<form method="POST" action="?/exportCsv" use:enhance>
			<button type="submit" class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Export CSV</button>
		</form>
	</div>

	{#if form?.success}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">Member updated.</div>
	{/if}

	<!-- Filters -->
	<div class="mb-4">
		<form onsubmit={(e) => { e.preventDefault(); handleSearch(); }} class="flex gap-2 mb-3">
			<input type="text" placeholder="Search by name or email..." bind:value={search} class="input flex-1" />
			<button type="submit" class="btn-primary">Search</button>
		</form>
		<div class="flex gap-2">
			<a href="/admin/members" class="text-xs px-3 py-1.5 rounded-full border transition-colors {!data.sectionFilter && !data.roleFilter ? 'bg-mg-forest text-white border-mg-forest' : 'bg-white text-mg-warmGray border-mg-stone hover:border-mg-forest'} no-underline">All</a>
			<a href="/admin/members?section=woods" class="text-xs px-3 py-1.5 rounded-full border transition-colors {data.sectionFilter === 'woods' ? 'bg-mg-forest text-white border-mg-forest' : 'bg-white text-mg-warmGray border-mg-stone hover:border-mg-forest'} no-underline">Woods</a>
			<a href="/admin/members?section=reserves" class="text-xs px-3 py-1.5 rounded-full border transition-colors {data.sectionFilter === 'reserves' ? 'bg-mg-forest text-white border-mg-forest' : 'bg-white text-mg-warmGray border-mg-stone hover:border-mg-forest'} no-underline">Reserves</a>
			<a href="/admin/members?role=board" class="text-xs px-3 py-1.5 rounded-full border transition-colors {data.roleFilter === 'board' ? 'bg-mg-forest text-white border-mg-forest' : 'bg-white text-mg-warmGray border-mg-stone hover:border-mg-forest'} no-underline">Board</a>
		</div>
	</div>

	<!-- Table -->
	<div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
		{#if data.members.length === 0}
			<p class="py-8 text-center text-gray-400">No members found.</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Name</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Email</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Section</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Lot</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Events</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Role</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Admin</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Verified</th>
							<th class="bg-gray-50 px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b">Joined</th>
						</tr>
					</thead>
					<tbody>
						{#each data.members as member}
							<tr class="border-b border-gray-100">
								<td class="px-3 py-2 text-sm font-medium">
									<a href="/admin/members/{member.id}" class="text-mg-forest hover:underline no-underline">{member.firstName} {member.lastName}</a>
								</td>
								<td class="px-3 py-2 text-sm text-gray-500">{member.email}</td>
								<td class="px-3 py-2">
									{#if member.section}
										<span class="badge badge-green">{member.section === 'woods' ? 'Woods' : 'Reserves'}</span>
									{:else}
										<span class="text-xs text-gray-300">--</span>
									{/if}
								</td>
								<td class="px-3 py-2 text-sm text-gray-500">{member.lotNumber ?? '--'}</td>
								<td class="px-3 py-2 text-sm">{member.eventsAttended}</td>
								<td class="px-3 py-2">
									<form method="POST" action="?/updateRole" use:enhance class="inline">
										<input type="hidden" name="id" value={member.id} />
										<select name="role" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="text-xs px-1 py-0.5 border border-gray-300 rounded">
											<option value="member" selected={member.role === 'member'}>Member</option>
											<option value="board" selected={member.role === 'board'}>Board</option>
										</select>
									</form>
								</td>
								<td class="px-3 py-2">
									{#if assignableRoles.length > 0 && (data.currentUserRole === 'tech_admin' || member.adminRole !== 'tech_admin')}
										<form method="POST" action="?/updateAdminRole" use:enhance class="inline">
											<input type="hidden" name="id" value={member.id} />
											<select name="adminRole" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="text-xs px-1 py-0.5 border border-gray-300 rounded">
												<option value="" selected={!member.adminRole}>None</option>
												{#each assignableRoles as role}
													<option value={role} selected={member.adminRole === role}>{ADMIN_ROLE_LABELS[role]}</option>
												{/each}
											</select>
										</form>
									{:else if member.adminRole}
										<span class="badge badge-gold">{ADMIN_ROLE_LABELS[member.adminRole as AdminRole] ?? member.adminRole}</span>
									{:else}
										<span class="text-xs text-gray-300">--</span>
									{/if}
								</td>
								<td class="px-3 py-2">
									<span class="text-xs font-medium px-2 py-0.5 rounded-full {member.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
										{member.emailVerified ? 'Yes' : 'No'}
									</span>
								</td>
								<td class="px-3 py-2 text-xs text-gray-400">{member.createdAt?.toISOString().split('T')[0] || '--'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>
