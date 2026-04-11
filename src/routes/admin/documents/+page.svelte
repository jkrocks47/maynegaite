<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editingId = $state<string | null>(null);

	const categories = [
		'bylaws',
		'minutes',
		'newsletter',
		'financial',
		'covenant',
		'other'
	] as const;

	const categoryLabels: Record<(typeof categories)[number], string> = {
		bylaws: 'Bylaws',
		minutes: 'Minutes',
		newsletter: 'Newsletter',
		financial: 'Financial',
		covenant: 'Covenant',
		other: 'Other'
	};

	function inputDateValue(value: Date | null): string {
		if (!value) return '';
		const d = new Date(value);
		const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString();
		return iso.slice(0, 16);
	}
</script>

<svelte:head>
	<title>Documents - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-6xl">
	<h1 class="text-2xl font-bold text-mg-charcoal mb-6">Document Library Management</h1>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Document saved.</div>
	{/if}

	<section class="card-elevated mb-6">
		<h2 class="text-lg font-semibold text-mg-charcoal mb-3">Add Document</h2>
		<form method="POST" action="?/create" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<label for="title" class="block text-sm font-medium text-mg-charcoal mb-1">Title *</label>
				<input id="title" name="title" required class="input" />
			</div>
			<div>
				<label for="category" class="block text-sm font-medium text-mg-charcoal mb-1">Category *</label>
				<select id="category" name="category" class="input">
					{#each categories as category}
						<option value={category}>{categoryLabels[category]}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<label for="description" class="block text-sm font-medium text-mg-charcoal mb-1">Description</label>
				<textarea id="description" name="description" rows="3" class="input"></textarea>
			</div>
			<div>
				<label for="fileUrl" class="block text-sm font-medium text-mg-charcoal mb-1">Document URL</label>
				<input id="fileUrl" name="fileUrl" type="url" class="input" placeholder="https://..." />
			</div>
			<div>
				<label for="publishedAt" class="block text-sm font-medium text-mg-charcoal mb-1">Published At</label>
				<input id="publishedAt" name="publishedAt" type="datetime-local" class="input" />
			</div>
			<div class="md:col-span-2">
				<button type="submit" class="btn-primary">Create Document</button>
			</div>
		</form>
	</section>

	<section class="card-elevated overflow-x-auto">
		{#if data.docs.length === 0}
			<p class="text-mg-warmGray">No documents added yet.</p>
		{:else}
			<table class="w-full border-collapse min-w-[980px]">
				<thead>
					<tr>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Title</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Category</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">URL</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Published</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.docs as doc}
						<tr class="border-b border-mg-stone/70 align-top">
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								<div class="font-medium">{doc.title}</div>
								{#if doc.description}
									<div class="text-xs text-mg-warmGray mt-1">{doc.description}</div>
								{/if}
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{categoryLabels[doc.category] ?? doc.category}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">
								{#if doc.fileUrl}
									<a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" class="text-mg-forest hover:underline">Open</a>
								{:else}
									--
								{/if}
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{doc.publishedAt ? new Date(doc.publishedAt).toLocaleDateString('en-US') : '--'}</td>
							<td class="px-3 py-3">
								<div class="flex gap-2 flex-wrap">
									<button type="button" class="btn-secondary text-xs" onclick={() => editingId = editingId === doc.id ? null : doc.id}>Edit</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={doc.id} />
										<button type="submit" class="text-xs text-red-600 hover:underline" onclick={(e) => {
											if (!confirm('Delete this document?')) e.preventDefault();
										}}>Delete</button>
									</form>
								</div>
							</td>
						</tr>
						{#if editingId === doc.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="5" class="px-3 py-4 bg-mg-parchment/40">
									<form method="POST" action="?/update" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
										<input type="hidden" name="id" value={doc.id} />
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Title *</label>
											<input name="title" value={doc.title} required class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Category *</label>
											<select name="category" class="input">
												{#each categories as category}
													<option value={category} selected={doc.category === category}>{categoryLabels[category]}</option>
												{/each}
											</select>
										</div>
										<div class="md:col-span-2">
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Description</label>
											<textarea name="description" rows="3" class="input">{doc.description || ''}</textarea>
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Document URL</label>
											<input name="fileUrl" type="url" value={doc.fileUrl || ''} class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Published At</label>
											<input name="publishedAt" type="datetime-local" value={inputDateValue(doc.publishedAt)} class="input" />
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
