<script lang="ts">
	import { enhance } from '$app/forms';
	import { renderMarkdown } from '$lib/utils/markdown';
	import type { ContentEntry } from '$lib/utils/content-registry';

	interface Props {
		entries: ContentEntry[];
		content: Record<string, string>;
		pageGroups: string[];
	}

	let { entries, content, pageGroups }: Props = $props();

	let expandedGroups = $state<Record<string, boolean>>({});
	let previewSections = $state<Record<string, boolean>>({});
	let savedSections = $state<Record<string, boolean>>({});

	function toggleGroup(group: string) {
		expandedGroups[group] = !expandedGroups[group];
	}

	function togglePreview(section: string) {
		previewSections[section] = !previewSections[section];
	}

	function getEntriesForPage(page: string): ContentEntry[] {
		return entries.filter((e) => e.page === page);
	}

	function showSaved(key: string) {
		savedSections[key] = true;
		setTimeout(() => {
			savedSections[key] = false;
		}, 2000);
	}
</script>

<div class="space-y-6">
	{#each pageGroups as group}
		{@const pageEntries = getEntriesForPage(group)}
		{#if pageEntries.length > 0}
			<div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
				<button
					class="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
					onclick={() => toggleGroup(group)}
				>
					<div class="flex items-center gap-3">
						<span class="text-lg font-semibold text-gray-800">{group}</span>
						<span class="text-xs text-gray-400 font-normal">{pageEntries.length} editable sections</span>
					</div>
					<span class="text-gray-400 text-sm">{expandedGroups[group] ? '▼' : '▶'}</span>
				</button>

				{#if expandedGroups[group]}
					<div class="p-6 space-y-6 border-t border-gray-100">
						{#each pageEntries as entry}
							{@const sectionKey = `${entry.slug}|${entry.section}`}
							{@const currentValue = content[entry.section] ?? ''}
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

								<div class="space-y-2">
									<label
										for="content-{sectionKey}"
										class="block text-sm font-medium text-gray-700"
									>
										{entry.label}
									</label>
									<p class="text-xs text-gray-400">
										Section: <code class="bg-gray-100 px-1 rounded">{entry.section}</code>
										&middot; Appears on: <code class="bg-gray-100 px-1 rounded">/{entry.slug === 'home' ? '' : entry.slug}</code>
									</p>

									{#if entry.fieldType === 'short'}
										<input
											id="content-{sectionKey}"
											type="text"
											name="body"
											value={currentValue}
											class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
										/>
									{:else if entry.fieldType === 'long'}
										<textarea
											id="content-{sectionKey}"
											name="body"
											rows="3"
											class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
										>{currentValue}</textarea>
									{:else if entry.fieldType === 'markdown'}
										<div class="space-y-2">
											<textarea
												id="content-{sectionKey}"
												name="body"
												rows="6"
												class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
											>{currentValue}</textarea>
											<button
												type="button"
												class="text-xs text-indigo-600 hover:text-indigo-800"
												onclick={() => togglePreview(sectionKey)}
											>
												{previewSections[sectionKey] ? 'Hide Preview' : 'Show Preview'}
											</button>
											{#if previewSections[sectionKey]}
												<div class="p-4 bg-gray-50 rounded-md border border-gray-200 prose prose-sm max-w-none">
													{@html renderMarkdown(currentValue)}
												</div>
											{/if}
										</div>
									{/if}

									<div class="flex items-center gap-3">
										<button
											type="submit"
											class="px-4 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
										>
											Save
										</button>
										{#if savedSections[sectionKey]}
											<span class="text-sm text-green-600">Saved!</span>
										{/if}
									</div>
								</div>
							</form>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/each}
</div>
