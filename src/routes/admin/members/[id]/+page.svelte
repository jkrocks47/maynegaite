<script lang="ts">
	import { enhance } from '$app/forms';
	import { ADMIN_ROLES, ADMIN_ROLE_LABELS, SECTION_LABELS } from '$lib/utils/constants';
	import type { AdminRole } from '$lib/utils/constants';

	let { data, form } = $props();
	const member = $derived(data.member);
	let showDeleteConfirm = $state(false);
</script>

<svelte:head>
	<title>{member.firstName} {member.lastName} - Members - Admin</title>
</svelte:head>

<div class="max-w-3xl">
	<a href="/admin/members" class="text-sm text-mg-forest hover:underline no-underline mb-4 inline-block">&larr; All Members</a>

	{#if form?.success}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">Member updated.</div>
	{/if}
	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{form.error}</div>
	{/if}

	<!-- Profile card -->
	<div class="card-elevated mb-4">
		<div class="flex justify-between items-start flex-wrap gap-3 mb-4">
			<div>
				<h1 class="text-xl font-bold text-mg-charcoal">{member.firstName} {member.lastName}</h1>
				<p class="text-sm text-mg-warmGray">{member.email}</p>
			</div>
			<div class="flex gap-2 flex-wrap">
				{#if member.section}
					<span class="badge badge-green">{SECTION_LABELS[member.section as keyof typeof SECTION_LABELS] ?? member.section}</span>
				{/if}
				<span class="text-xs font-medium px-2 py-0.5 rounded-full {member.emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
					{member.emailVerified ? 'Verified' : 'Unverified'}
				</span>
			</div>
		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
			<div><span class="block text-xs font-semibold text-mg-warmGray uppercase mb-1">Lot</span><span class="text-sm">{member.lotNumber ?? '--'}</span></div>
			<div><span class="block text-xs font-semibold text-mg-warmGray uppercase mb-1">Phone</span><span class="text-sm">{member.phone ?? '--'}</span></div>
			<div><span class="block text-xs font-semibold text-mg-warmGray uppercase mb-1">Joined</span><span class="text-sm">{member.createdAt?.toISOString().split('T')[0] || '--'}</span></div>
			<div>
				<span class="block text-xs font-semibold text-mg-warmGray uppercase mb-1">Role</span>
				<form method="POST" action="?/updateRole" use:enhance class="inline">
					<select name="role" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="text-xs px-1 py-0.5 border border-gray-300 rounded">
						<option value="member" selected={member.role === 'member'}>Member</option>
						<option value="board" selected={member.role === 'board'}>Board</option>
					</select>
				</form>
			</div>
			<div>
				<span class="block text-xs font-semibold text-mg-warmGray uppercase mb-1">Admin Role</span>
				{#if data.currentUserRole === 'president'}
					<form method="POST" action="?/updateAdminRole" use:enhance class="inline">
						<select name="adminRole" onchange={(e) => e.currentTarget.form?.requestSubmit()} class="text-xs px-1 py-0.5 border border-gray-300 rounded">
							<option value="" selected={!member.adminRole}>None</option>
							{#each ADMIN_ROLES as role}
								<option value={role} selected={member.adminRole === role}>{ADMIN_ROLE_LABELS[role]}</option>
							{/each}
						</select>
					</form>
				{:else if member.adminRole}
					<span class="badge badge-gold">{ADMIN_ROLE_LABELS[member.adminRole as AdminRole] ?? member.adminRole}</span>
				{:else}
					<span class="text-sm text-gray-300">--</span>
				{/if}
			</div>
		</div>
	</div>

	<!-- Events Attended -->
	<div class="card-elevated mb-4">
		<h2 class="text-base font-semibold text-mg-charcoal mb-3">Events Attended ({data.attended.length})</h2>
		{#if data.attended.length === 0}
			<p class="text-sm text-mg-warmGray">No events attended.</p>
		{:else}
			<table class="w-full border-collapse text-sm">
				<thead><tr><th class="text-left text-xs font-semibold text-mg-warmGray uppercase py-2 border-b">Event</th><th class="text-left text-xs font-semibold text-mg-warmGray uppercase py-2 border-b">Date</th><th class="text-left text-xs font-semibold text-mg-warmGray uppercase py-2 border-b">Category</th></tr></thead>
				<tbody>
					{#each data.attended as event}
						<tr class="border-b border-gray-100">
							<td class="py-2"><a href="/admin/events/{event.eventId}" class="text-mg-forest hover:underline no-underline">{event.title}</a></td>
							<td class="py-2 text-mg-warmGray">{event.date}</td>
							<td class="py-2"><span class="badge badge-green">{event.eventCategory}</span></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- RSVPs -->
	<div class="card-elevated mb-4">
		<h2 class="text-base font-semibold text-mg-charcoal mb-3">RSVPs ({data.rsvps.length})</h2>
		{#if data.rsvps.length === 0}
			<p class="text-sm text-mg-warmGray">No RSVPs.</p>
		{:else}
			<table class="w-full border-collapse text-sm">
				<thead><tr><th class="text-left text-xs font-semibold text-mg-warmGray uppercase py-2 border-b">Event</th><th class="text-left text-xs font-semibold text-mg-warmGray uppercase py-2 border-b">Date</th><th class="text-left text-xs font-semibold text-mg-warmGray uppercase py-2 border-b">Status</th></tr></thead>
				<tbody>
					{#each data.rsvps as rsvp}
						<tr class="border-b border-gray-100">
							<td class="py-2"><a href="/admin/events/{rsvp.eventId}" class="text-mg-forest hover:underline no-underline">{rsvp.title}</a></td>
							<td class="py-2 text-mg-warmGray">{rsvp.date}</td>
							<td class="py-2">
								<span class="text-xs font-medium px-2 py-0.5 rounded-full
									{rsvp.status === 'going' ? 'bg-green-100 text-green-700' : rsvp.status === 'maybe' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}">
									{rsvp.status.replace('_', ' ')}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- Delete Member -->
	{#if data.currentUserRole === 'president'}
		<div class="card-elevated border-red-200">
			<h2 class="text-base font-semibold text-red-600 mb-2">Danger Zone</h2>
			{#if !showDeleteConfirm}
				<p class="text-sm text-mg-warmGray mb-3">Permanently delete this member and all their associated data.</p>
				<button class="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-md text-sm font-semibold cursor-pointer hover:bg-red-50" onclick={() => (showDeleteConfirm = true)}>Delete Member</button>
			{:else}
				<p class="text-sm text-mg-warmGray mb-3">Are you sure? This cannot be undone.</p>
				<div class="flex gap-2">
					<form method="POST" action="?/deleteMember" use:enhance>
						<button type="submit" class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-red-700">Yes, Delete</button>
					</form>
					<button class="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-200" onclick={() => (showDeleteConfirm = false)}>Cancel</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
