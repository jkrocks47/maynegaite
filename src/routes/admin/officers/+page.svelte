<script lang="ts">
	import { enhance } from '$app/forms';
	import SearchableSelect from '$lib/components/shared/SearchableSelect.svelte';

	let { data, form } = $props();
	let editingId = $state<string | null>(null);

	const memberSelectOptions = $derived([
		{ value: '', label: 'None' },
		...data.memberOptions.map(m => ({ value: m.id, label: `${m.lastName}, ${m.firstName} (${m.email})` }))
	]);

	const committeeLabels: Record<string, string> = {
		board: 'Board',
		architectural: 'Architectural',
		social: 'Social'
	};
</script>

<svelte:head>
	<title>Officers - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-6xl">
	<h1 class="text-2xl font-bold text-mg-charcoal mb-6">Board and Committee Management</h1>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Officer record saved.</div>
	{/if}

	<section class="card-elevated mb-6">
		<h2 class="text-lg font-semibold text-mg-charcoal mb-3">Add Officer</h2>
		<form method="POST" action="?/create" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="name" class="block text-sm font-medium text-mg-charcoal mb-1">Name *</label>
				<input id="name" name="name" required class="input" />
			</div>
			<div>
				<label for="position" class="block text-sm font-medium text-mg-charcoal mb-1">Position *</label>
				<input id="position" name="position" required class="input" />
			</div>
			<div>
				<label for="committeeType" class="block text-sm font-medium text-mg-charcoal mb-1">Committee *</label>
				<select id="committeeType" name="committeeType" class="input">
					<option value="board">Board</option>
					<option value="architectural">Architectural</option>
					<option value="social">Social</option>
				</select>
			</div>
			<div>
				<label for="sortOrder" class="block text-sm font-medium text-mg-charcoal mb-1">Sort Order</label>
				<input id="sortOrder" type="number" name="sortOrder" value="0" class="input" />
			</div>
			<div>
				<label for="email" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
				<input id="email" type="email" name="email" class="input" />
			</div>
			<div>
				<label for="memberId" class="block text-sm font-medium text-mg-charcoal mb-1">Linked Member</label>
				<SearchableSelect id="memberId" name="memberId" options={memberSelectOptions} placeholder="Search member..." />
			</div>
			<div class="md:col-span-2">
				<label for="imageUrl" class="block text-sm font-medium text-mg-charcoal mb-1">Image URL (optional)</label>
				<input id="imageUrl" name="imageUrl" class="input" placeholder="https://..." />
			</div>
			<div class="md:col-span-2">
				<label for="bio" class="block text-sm font-medium text-mg-charcoal mb-1">Bio</label>
				<textarea id="bio" name="bio" rows="3" class="input"></textarea>
			</div>
			<div class="md:col-span-2">
				<button type="submit" class="btn-primary">Add Officer</button>
			</div>
		</form>
	</section>

	<section class="card-elevated overflow-x-auto">
		{#if data.officers.length === 0}
			<p class="text-mg-warmGray">No officers configured yet.</p>
		{:else}
			<table class="w-full border-collapse min-w-[960px]">
				<thead>
					<tr>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Name</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Position</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Committee</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Linked Member</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Order</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.officers as officer}
						<tr class="border-b border-mg-stone/70 align-top">
							<td class="px-3 py-3 text-sm text-mg-charcoal">{officer.name}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{officer.position}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{committeeLabels[officer.committeeType] ?? officer.committeeType}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{officer.memberFirstName ? `${officer.memberFirstName} ${officer.memberLastName}` : '--'}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{officer.sortOrder}</td>
							<td class="px-3 py-3">
								<div class="flex gap-2 flex-wrap">
									<button type="button" class="btn-secondary text-xs" onclick={() => editingId = editingId === officer.id ? null : officer.id}>Edit</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={officer.id} />
										<button type="submit" class="text-xs text-red-600 hover:underline" onclick={(e) => {
											if (!confirm('Delete this officer?')) e.preventDefault();
										}}>Delete</button>
									</form>
								</div>
							</td>
						</tr>
						{#if editingId === officer.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="6" class="px-3 py-4 bg-mg-parchment/40">
									<form method="POST" action="?/update" use:enhance={() => async ({ result, update }) => {
								await update({ reset: false });
								if (result.type === 'success') editingId = null;
							}} class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input type="hidden" name="id" value={officer.id} />
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Name *</label>
											<input name="name" value={officer.name} required class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Position *</label>
											<input name="position" value={officer.position} required class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Committee</label>
											<select name="committeeType" class="input">
												<option value="board" selected={officer.committeeType === 'board'}>Board</option>
												<option value="architectural" selected={officer.committeeType === 'architectural'}>Architectural</option>
												<option value="social" selected={officer.committeeType === 'social'}>Social</option>
											</select>
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Sort Order</label>
											<input type="number" name="sortOrder" value={officer.sortOrder} class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
											<input type="email" name="email" value={officer.email || ''} class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Linked Member</label>
											<SearchableSelect name="memberId" value={officer.memberId || ''} options={memberSelectOptions} placeholder="Search member..." />
										</div>
										<div class="md:col-span-2">
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Image URL</label>
											<input name="imageUrl" value={officer.imageUrl || ''} class="input" />
										</div>
										<div class="md:col-span-2">
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Bio</label>
											<textarea name="bio" rows="3" class="input">{officer.bio || ''}</textarea>
										</div>
										<div class="md:col-span-2 flex gap-2">
											<button type="submit" class="btn-primary text-sm">Save</button>
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
