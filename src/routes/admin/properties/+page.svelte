<script lang="ts">
	import { enhance } from '$app/forms';
	import { SECTION_LABELS } from '$lib/utils/constants';
	import SearchableSelect from '$lib/components/shared/SearchableSelect.svelte';

	let { data, form } = $props();
	let editingId = $state<string | null>(null);

	let ownerSelectOptions = $derived([
		{ value: '', label: 'Unassigned' },
		...data.ownerOptions.map(o => ({ value: o.id, label: `${o.lastName}, ${o.firstName} (${o.email})` }))
	]);

	const propertyTypeLabels: Record<string, string> = {
		single_family: 'Single Family',
		townhome: 'Townhome'
	};
</script>

<svelte:head>
	<title>Properties - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-7xl">
	<h1 class="text-2xl font-bold text-mg-charcoal mb-6">Property Registry</h1>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Property record saved.</div>
	{/if}

	<section class="card-elevated mb-6">
		<h2 class="text-lg font-semibold text-mg-charcoal mb-3">Add Property</h2>
		<form method="POST" action="?/create" use:enhance class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<label for="lotNumber" class="block text-sm font-medium text-mg-charcoal mb-1">Lot Number *</label>
				<input id="lotNumber" name="lotNumber" type="number" min="1" max="197" required class="input" />
			</div>
			<div>
				<label for="section" class="block text-sm font-medium text-mg-charcoal mb-1">Section</label>
				<select id="section" name="section" class="input">
					<option value="">Unknown</option>
					<option value="woods">{SECTION_LABELS.woods}</option>
				</select>
			</div>
			<div>
				<label for="propertyType" class="block text-sm font-medium text-mg-charcoal mb-1">Property Type</label>
				<select id="propertyType" name="propertyType" class="input">
					<option value="">Unknown</option>
					<option value="single_family">Single Family</option>
					<option value="townhome">Townhome</option>
				</select>
			</div>
			<div class="md:col-span-2">
				<label for="address" class="block text-sm font-medium text-mg-charcoal mb-1">Address</label>
				<input id="address" name="address" class="input" />
			</div>
			<div>
				<label for="ownerId" class="block text-sm font-medium text-mg-charcoal mb-1">Owner</label>
				<SearchableSelect id="ownerId" name="ownerId" options={ownerSelectOptions} />
			</div>
			<div class="md:col-span-3">
				<button type="submit" class="btn-primary">Add Property</button>
			</div>
		</form>
	</section>

	<section class="card-elevated overflow-x-auto">
		<table class="w-full border-collapse min-w-[1100px]">
			<thead>
				<tr>
					<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Lot</th>
					<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Address</th>
					<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Section</th>
					<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Type</th>
					<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Owner</th>
					<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each data.lotRecords as lot}
					<tr class="border-b border-mg-stone/70 align-top">
						<td class="px-3 py-3 text-sm text-mg-charcoal">{lot.lotNumber}</td>
						<td class="px-3 py-3 text-sm text-mg-charcoal">{lot.address || '--'}</td>
						<td class="px-3 py-3 text-sm text-mg-charcoal">{lot.section ? SECTION_LABELS[lot.section] : '--'}</td>
						<td class="px-3 py-3 text-sm text-mg-charcoal">{lot.propertyType ? propertyTypeLabels[lot.propertyType] : '--'}</td>
						<td class="px-3 py-3 text-sm text-mg-charcoal">{lot.ownerFirstName ? `${lot.ownerFirstName} ${lot.ownerLastName}` : '--'}</td>
						<td class="px-3 py-3">
							<div class="flex gap-2 flex-wrap">
								<button type="button" class="btn-secondary text-xs" onclick={() => editingId = editingId === lot.id ? null : lot.id}>Edit</button>
								<form method="POST" action="?/delete" use:enhance>
									<input type="hidden" name="id" value={lot.id} />
									<button type="submit" class="text-xs text-red-600 hover:underline" onclick={(e) => {
										if (!confirm('Delete this property record?')) e.preventDefault();
									}}>Delete</button>
								</form>
							</div>
						</td>
					</tr>
					{#if editingId === lot.id}
						<tr class="border-b border-mg-stone/70">
							<td colspan="6" class="px-3 py-4 bg-mg-parchment/40">
								<form method="POST" action="?/update" use:enhance class="grid grid-cols-1 md:grid-cols-3 gap-4">
									<input type="hidden" name="id" value={lot.id} />
									<div>
										<label class="block text-sm font-medium text-mg-charcoal mb-1">Lot Number *</label>
										<input name="lotNumber" type="number" min="1" max="197" value={lot.lotNumber} required class="input" />
									</div>
									<div>
										<label class="block text-sm font-medium text-mg-charcoal mb-1">Section</label>
										<select name="section" class="input">
											<option value="" selected={!lot.section}>Unknown</option>
											<option value="woods" selected={lot.section === 'woods'}>{SECTION_LABELS.woods}</option>
										</select>
									</div>
									<div>
										<label class="block text-sm font-medium text-mg-charcoal mb-1">Property Type</label>
										<select name="propertyType" class="input">
											<option value="" selected={!lot.propertyType}>Unknown</option>
											<option value="single_family" selected={lot.propertyType === 'single_family'}>Single Family</option>
											<option value="townhome" selected={lot.propertyType === 'townhome'}>Townhome</option>
										</select>
									</div>
									<div class="md:col-span-2">
										<label class="block text-sm font-medium text-mg-charcoal mb-1">Address</label>
										<input name="address" value={lot.address || ''} class="input" />
									</div>
									<div>
										<label class="block text-sm font-medium text-mg-charcoal mb-1">Owner</label>
										<SearchableSelect name="ownerId" value={lot.ownerId || ''} options={ownerSelectOptions} />
									</div>
									<div class="md:col-span-3 flex gap-2">
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
	</section>
</div>
