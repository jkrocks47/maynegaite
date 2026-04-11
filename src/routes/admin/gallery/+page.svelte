<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let editingId = $state<string | null>(null);
</script>

<svelte:head>
	<title>Gallery - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-6xl">
	<h1 class="text-2xl font-bold text-mg-charcoal mb-6">Gallery Management</h1>

	{#if form?.error}
		<div class="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="rounded-lg border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm mb-4">Gallery updated.</div>
	{/if}

	<section class="card-elevated mb-6">
		<h2 class="text-lg font-semibold text-mg-charcoal mb-3">Upload Image</h2>
		<form method="POST" action="?/upload" enctype="multipart/form-data" use:enhance class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="md:col-span-2">
				<label for="image" class="block text-sm font-medium text-mg-charcoal mb-1">Image *</label>
				<input id="image" type="file" name="image" accept="image/*" required class="input" />
			</div>
			<div>
				<label for="caption" class="block text-sm font-medium text-mg-charcoal mb-1">Caption</label>
				<input id="caption" name="caption" class="input" />
			</div>
			<div>
				<label for="photographer" class="block text-sm font-medium text-mg-charcoal mb-1">Photographer</label>
				<input id="photographer" name="photographer" class="input" />
			</div>
			<div class="md:col-span-2">
				<label for="eventId" class="block text-sm font-medium text-mg-charcoal mb-1">Related Event (optional)</label>
				<select id="eventId" name="eventId" class="input">
					<option value="">None</option>
					{#each data.eventOptions as option}
						<option value={option.id}>{option.date} - {option.title}</option>
					{/each}
				</select>
			</div>
			<div class="md:col-span-2">
				<button type="submit" class="btn-primary">Upload</button>
			</div>
		</form>
	</section>

	<section class="card-elevated overflow-x-auto">
		{#if data.images.length === 0}
			<p class="text-mg-warmGray">No gallery images uploaded yet.</p>
		{:else}
			<table class="w-full border-collapse min-w-[900px]">
				<thead>
					<tr>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Image</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Caption</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Photographer</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Event</th>
						<th class="px-3 py-2 text-left text-xs font-semibold text-mg-warmGray uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.images as image}
						<tr class="border-b border-mg-stone/70 align-top">
							<td class="px-3 py-3">
								<img src={image.thumbnailUrl || image.url} alt={image.caption || 'Gallery image'} class="w-20 h-20 rounded object-cover border border-mg-stone" />
							</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{image.caption || '--'}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{image.photographer || '--'}</td>
							<td class="px-3 py-3 text-sm text-mg-charcoal">{image.eventTitle || '--'}</td>
							<td class="px-3 py-3">
								<div class="flex gap-2 flex-wrap">
									<button type="button" class="btn-secondary text-xs" onclick={() => editingId = editingId === image.id ? null : image.id}>Edit</button>
									<form method="POST" action="?/delete" use:enhance>
										<input type="hidden" name="id" value={image.id} />
										<button type="submit" class="text-xs text-red-600 hover:underline" onclick={(e) => {
											if (!confirm('Delete this image?')) e.preventDefault();
										}}>Delete</button>
									</form>
								</div>
							</td>
						</tr>
						{#if editingId === image.id}
							<tr class="border-b border-mg-stone/70">
								<td colspan="5" class="px-3 py-4 bg-mg-parchment/40">
									<form method="POST" action="?/update" use:enhance class="grid grid-cols-1 md:grid-cols-3 gap-3">
										<input type="hidden" name="id" value={image.id} />
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Caption</label>
											<input name="caption" value={image.caption || ''} class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Photographer</label>
											<input name="photographer" value={image.photographer || ''} class="input" />
										</div>
										<div>
											<label class="block text-sm font-medium text-mg-charcoal mb-1">Event</label>
											<select name="eventId" class="input">
												<option value="">None</option>
												{#each data.eventOptions as option}
													<option value={option.id} selected={image.eventId === option.id}>{option.date} - {option.title}</option>
												{/each}
											</select>
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
		{/if}
	</section>
</div>
