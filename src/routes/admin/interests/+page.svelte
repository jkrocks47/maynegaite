<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let newName = $state('');
</script>

<svelte:head>
	<title>Interests - UICSpacetime Admin</title>
</svelte:head>

<div class="interests-page">
	<h1 class="page-title">Manage Interests</h1>
	<p class="page-desc">Add or remove event interest options shown during registration and on member profiles.</p>

	{#if form?.error}
		<div class="error-message">{form.error}</div>
	{/if}

	{#if form?.success}
		<div class="success-message">Interest updated.</div>
	{/if}

	<!-- Add new interest -->
	<div class="add-card">
		<form method="POST" action="?/add" use:enhance={() => {
			return async ({ update }) => {
				await update({ reset: false });
				newName = '';
			};
		}}>
			<div class="add-row">
				<input type="text" name="name" placeholder="New interest name..." bind:value={newName} class="add-input" />
				<button type="submit" class="add-btn" disabled={!newName.trim()}>Add Interest</button>
			</div>
		</form>
	</div>

	<!-- Current interests list -->
	<div class="list-card">
		{#if data.interests.length === 0}
			<p class="empty-state">No interests defined yet. Add one above.</p>
		{:else}
			<ul class="interest-list">
				{#each data.interests as interest}
					<li class="interest-item">
						<span class="interest-name">{interest.name}</span>
						<form method="POST" action="?/delete" use:enhance class="inline-form">
							<input type="hidden" name="id" value={interest.id} />
							<button type="submit" class="delete-btn" onclick={(e) => {
								if (!confirm(`Delete "${interest.name}"? Existing member preferences will be preserved.`)) e.preventDefault();
							}}>Delete</button>
						</form>
					</li>
				{/each}
			</ul>
		{/if}
	</div>

	<p class="info-note">
		Deleting an interest removes it from future forms. Members who already selected it keep it in their profile data.
	</p>
</div>

<style>
	.interests-page { max-width: 600px; }

	.page-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #191923;
	}

	.page-desc {
		font-size: 0.85rem;
		color: #6b7280;
		margin-top: 0.25rem;
		margin-bottom: 1.5rem;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.success-message {
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		color: #16a34a;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		margin-bottom: 1rem;
	}

	.add-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.add-row {
		display: flex;
		gap: 0.5rem;
	}

	.add-input {
		flex: 1;
		padding: 0.5rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.85rem;
		color: #374151;
	}

	.add-input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.add-btn {
		padding: 0.5rem 1rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.825rem;
		font-weight: 500;
		cursor: pointer;
		white-space: nowrap;
	}

	.add-btn:hover { background: #4338ca; }
	.add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

	.list-card {
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.empty-state {
		padding: 2rem;
		text-align: center;
		color: #9ca3af;
		font-size: 0.9rem;
	}

	.interest-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.interest-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #f3f4f6;
	}

	.interest-item:last-child { border-bottom: none; }

	.interest-name {
		font-size: 0.9rem;
		font-weight: 500;
		color: #374151;
	}

	.inline-form { display: inline; }

	.delete-btn {
		background: none;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.25rem 0.6rem;
		border-radius: 0.25rem;
		font-size: 0.7rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.delete-btn:hover { background: #fef2f2; }

	.info-note {
		font-size: 0.75rem;
		color: #9ca3af;
		margin-top: 1rem;
		line-height: 1.5;
	}
</style>
