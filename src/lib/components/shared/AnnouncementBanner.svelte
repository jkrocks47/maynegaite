<script lang="ts">
	let {
		announcements,
		theme = 'dark'
	}: {
		announcements: Array<{
			id: string;
			title: string;
			body: string;
			isPinned: boolean;
		}>;
		theme?: 'dark' | 'light';
	} = $props();

	// Sort pinned first
	let sorted = $derived(
		[...announcements].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
	);
</script>

{#if sorted.length > 0}
	<div class="announcements" class:dark={theme === 'dark'} class:light={theme === 'light'}>
		{#each sorted as ann}
			<div class="announcement" class:pinned={ann.isPinned}>
				{#if ann.isPinned}<span class="pin-icon">&#128204;</span>{/if}
				<strong class="ann-title">{ann.title}</strong>
				<span class="ann-body">{ann.body}</span>
			</div>
		{/each}
	</div>
{/if}

<style>
	.announcements {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.announcement {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.dark .announcement {
		background: rgba(79, 70, 229, 0.1);
		border: 1px solid rgba(79, 70, 229, 0.2);
		color: #c4b5fd;
	}

	.light .announcement {
		background: #eef2ff;
		border: 1px solid #c7d2fe;
		color: #4338ca;
	}

	.dark .announcement.pinned {
		background: rgba(234, 179, 8, 0.1);
		border-color: rgba(234, 179, 8, 0.25);
		color: #fde047;
	}

	.light .announcement.pinned {
		background: #fefce8;
		border-color: #fde68a;
		color: #a16207;
	}

	.pin-icon { font-size: 0.75rem; }

	.ann-title {
		font-weight: 600;
		margin-right: 0.35rem;
	}

	.ann-body {
		opacity: 0.85;
	}
</style>
