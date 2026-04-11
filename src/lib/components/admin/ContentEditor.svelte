<script lang="ts">
	import { enhance } from '$app/forms';
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { ContentEntry } from '$lib/utils/content-registry';
	import VisualPagePreview from './VisualPagePreview.svelte';

	interface Props {
		entries: ContentEntry[];
		content: Record<string, string>; // keyed by slug|section
		pageGroups: string[];
	}

	let { entries, content, pageGroups }: Props = $props();

	let activePage = $state(pageGroups[0] ?? '');
	let activeSection = $state<string | null>(null);
	let savedSections = $state<Record<string, boolean>>({});
	let previewSections = $state<Record<string, boolean>>({});

	// Local copy of content for live preview updates via bind:value
	let editedContent = $state<Record<string, string>>({});

	// Sync from server content (runs on mount + after each save)
	$effect(() => {
		editedContent = { ...content };
	});

	let currentPageEntries = $derived(entries.filter((e) => e.page === activePage));

	function selectSection(sectionKey: string) {
		activeSection = sectionKey;
		const el = document.getElementById(`editor-${sectionKey}`);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'center' });
			el.classList.add('highlight-pulse');
			setTimeout(() => el.classList.remove('highlight-pulse'), 1500);
		}
	}

	function liveUrl(): string {
		const slug = currentPageEntries[0]?.slug ?? '';
		if (slug === 'home' || slug === 'footer') return '/';
		return `/${slug}`;
	}

	function togglePreview(key: string) {
		previewSections[key] = !previewSections[key];
	}

	function showSaved(key: string) {
		savedSections[key] = true;
		setTimeout(() => {
			savedSections[key] = false;
		}, 2000);
	}

	function getPageCount(page: string): number {
		return entries.filter((e) => e.page === page).length;
	}
</script>

<div class="editor-root">
	<!-- Tab Bar -->
	<div class="tab-bar">
		<div class="tab-list">
			{#each pageGroups as group}
				{@const count = getPageCount(group)}
				{#if count > 0}
					<button
						class="tab-btn"
						class:tab-active={activePage === group}
						onclick={() => {
							activePage = group;
							activeSection = null;
						}}
					>
						{group}
						<span class="tab-count">{count}</span>
					</button>
				{/if}
			{/each}
		</div>
		<a href={liveUrl()} target="_blank" rel="noopener noreferrer" class="view-live-link">
			View live ↗
		</a>
	</div>

	<!-- Two-Column Layout -->
	<div class="editor-grid">
		<!-- Left: Visual Preview -->
		<div class="preview-col">
			<div class="preview-frame">
				<div class="preview-frame-bar">
					<div class="dot red"></div>
					<div class="dot yellow"></div>
					<div class="dot green"></div>
					<span class="preview-url">maynegaite.com{liveUrl()}</span>
				</div>
				<VisualPagePreview
					page={activePage}
					content={editedContent}
					entries={currentPageEntries}
					{activeSection}
					onSelectSection={selectSection}
				/>
			</div>
			<p class="preview-hint">
				<svg class="hint-icon" viewBox="0 0 20 20" fill="currentColor">
					<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
				</svg>
				Click any highlighted area to jump to its editor. Changes preview in real-time.
			</p>
		</div>

		<!-- Right: Edit Forms -->
		<div class="forms-col">
			{#each currentPageEntries as entry (`${entry.slug}|${entry.section}`)}
				{@const sectionKey = `${entry.slug}|${entry.section}`}
				<div
					id="editor-{sectionKey}"
					class="form-card"
					class:form-card-active={sectionKey === activeSection}
				>
					<form
						method="POST"
						action="?/update"
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								showSaved(sectionKey);
							};
						}}
					>
						<input type="hidden" name="slug" value={entry.slug} />
						<input type="hidden" name="section" value={entry.section} />

						<div class="form-header">
							<label for="edit-{sectionKey}" class="form-label">
								{entry.label}
							</label>
							<span class="form-badge">{entry.fieldType}</span>
						</div>
						<p class="form-meta">
							<code>/{entry.slug === 'home' ? '' : entry.slug}</code>
							<span class="sep">·</span>
							<code>{entry.section}</code>
						</p>

						{#if entry.fieldType === 'short'}
							<input
								id="edit-{sectionKey}"
								type="text"
								name="body"
								bind:value={editedContent[sectionKey]}
								class="form-input"
								onfocus={() => { activeSection = sectionKey; }}
							/>
						{:else if entry.fieldType === 'long'}
							<textarea
								id="edit-{sectionKey}"
								name="body"
								rows="3"
								bind:value={editedContent[sectionKey]}
								class="form-textarea"
								onfocus={() => { activeSection = sectionKey; }}
							></textarea>
						{:else if entry.fieldType === 'markdown'}
							<textarea
								id="edit-{sectionKey}"
								name="body"
								rows="5"
								bind:value={editedContent[sectionKey]}
								class="form-textarea form-mono"
								onfocus={() => { activeSection = sectionKey; }}
							></textarea>
							<button
								type="button"
								class="md-toggle"
								onclick={() => togglePreview(sectionKey)}
							>
								{previewSections[sectionKey] ? '▾ Hide Preview' : '▸ Show Preview'}
							</button>
							{#if previewSections[sectionKey]}
								<div class="md-preview prose prose-sm max-w-none">
									{@html renderMarkdown(editedContent[sectionKey] ?? '')}
								</div>
							{/if}
						{/if}

						<div class="form-actions">
							<button type="submit" class="save-btn">
								<svg class="save-icon" viewBox="0 0 20 20" fill="currentColor">
									<path d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" />
								</svg>
								Save
							</button>
							{#if savedSections[sectionKey]}
								<span class="saved-badge">✓ Saved</span>
							{/if}
						</div>
					</form>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	/* === Root === */
	.editor-root {}

	/* === Tab Bar === */
	.tab-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 2px solid #e5e7eb;
		margin-bottom: 1.5rem;
		gap: 1rem;
	}
	.tab-list {
		display: flex;
		gap: 1px;
		overflow-x: auto;
		scrollbar-width: thin;
	}
	.tab-btn {
		padding: 0.6rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 500;
		white-space: nowrap;
		background: none;
		border: none;
		border-radius: 0.5rem 0.5rem 0 0;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.15s;
		position: relative;
	}
	.tab-btn:hover {
		color: #1f2937;
		background: #f3f4f6;
	}
	.tab-active {
		color: #1B4332;
		background: rgba(27, 67, 50, 0.05);
		font-weight: 600;
	}
	.tab-active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 2px;
		background: #1B4332;
		border-radius: 1px 1px 0 0;
	}
	.tab-count {
		margin-left: 0.25rem;
		font-size: 0.625rem;
		font-weight: 400;
		color: #b0b0b0;
	}
	.tab-active .tab-count { color: rgba(27, 67, 50, 0.45); }

	.view-live-link {
		font-size: 0.75rem;
		color: #1B4332;
		text-decoration: none;
		white-space: nowrap;
		padding: 0.3rem 0.625rem;
		border-radius: 0.375rem;
		border: 1px solid #e5e7eb;
		transition: all 0.15s;
		flex-shrink: 0;
	}
	.view-live-link:hover {
		background: rgba(27, 67, 50, 0.05);
		border-color: #1B4332;
	}

	/* === Grid Layout === */
	.editor-grid {
		display: grid;
		grid-template-columns: 380px 1fr;
		gap: 1.5rem;
		align-items: start;
	}
	@media (max-width: 1100px) {
		.editor-grid { grid-template-columns: 1fr; }
		.preview-col { position: static !important; }
	}

	/* === Preview Column === */
	.preview-col {
		position: sticky;
		top: 1rem;
	}
	.preview-frame {
		background: #fff;
		border-radius: 0.625rem;
		border: 1px solid #e0e0e0;
		overflow: hidden;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06), 0 8px 24px rgba(0, 0, 0, 0.04);
	}
	.preview-frame-bar {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.5rem 0.75rem;
		background: #f5f5f5;
		border-bottom: 1px solid #eaeaea;
	}
	.dot {
		width: 8px; height: 8px; border-radius: 50%;
	}
	.dot.red { background: #ff5f57; }
	.dot.yellow { background: #febc2e; }
	.dot.green { background: #28c840; }
	.preview-url {
		font-size: 0.6rem;
		color: #999;
		margin-left: 0.5rem;
		font-family: 'Menlo', 'Monaco', monospace;
	}

	.preview-hint {
		display: flex;
		align-items: flex-start;
		gap: 0.375rem;
		font-size: 0.6875rem;
		color: #9ca3af;
		margin-top: 0.625rem;
		padding-left: 0.125rem;
		line-height: 1.4;
	}
	.hint-icon {
		width: 14px; height: 14px;
		flex-shrink: 0;
		color: #b0b0b0;
		margin-top: 1px;
	}

	/* === Forms Column === */
	.forms-col {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}
	.form-card {
		background: #fff;
		border-radius: 0.625rem;
		border: 2px solid transparent;
		padding: 1rem 1.25rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
		transition: border-color 0.2s ease, box-shadow 0.25s ease;
	}
	.form-card-active {
		border-color: #1B4332;
		box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);
	}
	:global(.highlight-pulse) {
		animation: highlight-pulse 1.5s ease !important;
	}
	@keyframes highlight-pulse {
		0% { box-shadow: 0 0 0 0 rgba(27, 67, 50, 0.35); }
		50% { box-shadow: 0 0 0 8px rgba(27, 67, 50, 0.06); }
		100% { box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04); }
	}

	.form-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}
	.form-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: #1f2937;
	}
	.form-badge {
		font-size: 0.5625rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #9ca3af;
		background: #f3f4f6;
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
	}
	.form-meta {
		font-size: 0.6875rem;
		color: #b0b0b0;
		margin-top: 0.125rem;
		margin-bottom: 0.5rem;
	}
	.form-meta code {
		background: #f5f5f5;
		padding: 0 0.2rem;
		border-radius: 3px;
		font-size: 0.625rem;
	}
	.sep { margin: 0 0.2rem; color: #d1d5db; }

	.form-input,
	.form-textarea {
		display: block;
		width: 100%;
		padding: 0.5rem 0.625rem;
		border: 1px solid #d1d5db;
		border-radius: 0.4rem;
		font-size: 0.8125rem;
		color: #1f2937;
		line-height: 1.5;
		transition: border-color 0.15s, box-shadow 0.15s;
		background: #fafafa;
	}
	.form-input:focus,
	.form-textarea:focus {
		outline: none;
		border-color: #1B4332;
		box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.1);
		background: #fff;
	}
	.form-textarea { resize: vertical; min-height: 3.5rem; }
	.form-mono {
		font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
		font-size: 0.75rem;
	}

	.md-toggle {
		background: none; border: none;
		font-size: 0.6875rem; color: #1B4332;
		cursor: pointer; padding: 0.25rem 0;
		margin-top: 0.25rem; font-weight: 500;
	}
	.md-toggle:hover { text-decoration: underline; }

	.md-preview {
		margin-top: 0.375rem;
		padding: 0.625rem;
		background: #fafafa;
		border: 1px solid #e5e7eb;
		border-radius: 0.4rem;
		font-size: 0.8125rem;
	}

	.form-actions {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		margin-top: 0.625rem;
	}
	.save-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.375rem 0.875rem;
		background: #1B4332;
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}
	.save-btn:hover { background: #143728; }
	.save-icon { width: 14px; height: 14px; }

	.saved-badge {
		font-size: 0.75rem;
		color: #059669;
		font-weight: 600;
		animation: fade-saved 2s ease forwards;
	}
	@keyframes fade-saved {
		0% { opacity: 0; transform: translateY(4px); }
		10% { opacity: 1; transform: translateY(0); }
		80% { opacity: 1; }
		100% { opacity: 0; }
	}
</style>
