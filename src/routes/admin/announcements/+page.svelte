<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let showForm = $state(false);
</script>

<svelte:head>
	<title>Announcements - Maynegaite Admin</title>
</svelte:head>

<div class="max-w-[900px]">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-xl font-bold text-gray-800">Announcements</h1>
		<button class="btn-primary text-sm" onclick={() => (showForm = !showForm)}>
			{showForm ? 'Cancel' : '+ New Announcement'}
		</button>
	</div>

	{#if form?.error}
		<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{form.error}</div>
	{/if}
	{#if form?.success}
		<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-4">Announcement saved.</div>
	{/if}

	{#if showForm}
		<div class="card-elevated mb-6">
			<h2 class="text-base font-semibold text-gray-700 mb-4">New Announcement</h2>
			<form method="POST" action="?/create" use:enhance={() => {
				return async ({ update }) => { await update(); showForm = false; };
			}}>
				<div class="space-y-4">
					<div>
						<label for="title" class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
						<input type="text" id="title" name="title" required class="input" />
					</div>
					<div>
						<label for="body" class="block text-sm font-medium text-gray-700 mb-1">Body *</label>
						<textarea id="body" name="body" rows="4" required class="input"></textarea>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
							<input type="text" id="category" name="category" placeholder="Optional" class="input" />
						</div>
						<div class="flex items-end pb-1">
							<label class="flex items-center gap-2 cursor-pointer text-sm">
								<input type="checkbox" name="isPinned" /> Pinned
							</label>
						</div>
					</div>
					<div class="grid grid-cols-2 gap-4">
						<div>
							<label for="publishAt" class="block text-sm font-medium text-gray-700 mb-1">Publish At</label>
							<input type="datetime-local" id="publishAt" name="publishAt" class="input" />
						</div>
						<div>
							<label for="expiresAt" class="block text-sm font-medium text-gray-700 mb-1">Expires At</label>
							<input type="datetime-local" id="expiresAt" name="expiresAt" class="input" />
						</div>
					</div>
					<button type="submit" class="btn-primary">Create Announcement</button>
				</div>
			</form>
		</div>
	{/if}

	<div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
		{#if data.announcements.length === 0}
			<p class="py-8 text-center text-gray-400">No announcements yet.</p>
		{:else}
			<table class="w-full border-collapse">
				<thead>
					<tr>
						<th class="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Title</th>
						<th class="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Category</th>
						<th class="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Pinned</th>
						<th class="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Expires</th>
						<th class="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase border-b">Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each data.announcements as ann}
						<tr class="border-b border-gray-100">
							<td class="px-4 py-3 text-sm font-medium text-gray-800">{ann.title}</td>
							<td class="px-4 py-3 text-sm text-gray-500">{ann.category || 'General'}</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/togglePin" use:enhance class="inline">
									<input type="hidden" name="id" value={ann.id} />
									<button type="submit" class="text-xs px-2 py-0.5 rounded-full border {ann.isPinned ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'border-gray-300 text-gray-500'} cursor-pointer">
										{ann.isPinned ? 'Pinned' : 'Pin'}
									</button>
								</form>
							</td>
							<td class="px-4 py-3 text-xs text-gray-400">{ann.expiresAt ? ann.expiresAt.toISOString().split('T')[0] : '--'}</td>
							<td class="px-4 py-3">
								<form method="POST" action="?/delete" use:enhance class="inline">
									<input type="hidden" name="id" value={ann.id} />
									<button type="submit" class="text-xs px-2 py-0.5 border border-red-200 text-red-600 rounded cursor-pointer hover:bg-red-50" onclick={(e) => {
										if (!confirm('Delete this announcement?')) e.preventDefault();
									}}>Delete</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
