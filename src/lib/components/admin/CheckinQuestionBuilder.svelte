<script lang="ts">
	import type { CheckinQuestion } from '$lib/server/db/schema';

	interface Props {
		questions: CheckinQuestion[];
		name?: string;
	}

	let { questions = $bindable([]), name = 'checkinQuestions' }: Props = $props();

	let newOption = $state<Record<string, string>>({});

	function addQuestion() {
		questions = [...questions, {
			id: crypto.randomUUID(),
			question: '',
			type: 'text',
			required: false
		}];
	}

	function removeQuestion(index: number) {
		questions = questions.filter((_, i) => i !== index);
	}

	function addOption(questionId: string) {
		const val = (newOption[questionId] || '').trim();
		if (!val) return;
		questions = questions.map((q) => {
			if (q.id === questionId) {
				return { ...q, options: [...(q.options || []), val] };
			}
			return q;
		});
		newOption[questionId] = '';
	}

	function removeOption(questionId: string, optIndex: number) {
		questions = questions.map((q) => {
			if (q.id === questionId) {
				return { ...q, options: (q.options || []).filter((_, i) => i !== optIndex) };
			}
			return q;
		});
	}
</script>

<div class="qb-container">
	<div class="qb-header">
		<label class="qb-label">Check-in Questions</label>
		<button type="button" class="qb-add-btn" onclick={addQuestion}>+ Add Question</button>
	</div>

	<input type="hidden" {name} value={JSON.stringify(questions)} />

	{#if questions.length === 0}
		<p class="qb-empty">No check-in questions. Members will be checked in immediately.</p>
	{:else}
		<div class="qb-list">
			{#each questions as q, i}
				<div class="qb-card">
					<div class="qb-card-header">
						<span class="qb-num">Q{i + 1}</span>
						<button type="button" class="qb-remove" onclick={() => removeQuestion(i)}>Remove</button>
					</div>

					<div class="qb-field">
						<input
							type="text"
							placeholder="Question text..."
							value={q.question}
							oninput={(e) => {
								questions = questions.map((item, idx) =>
									idx === i ? { ...item, question: e.currentTarget.value } : item
								);
							}}
							class="qb-input"
						/>
					</div>

					<div class="qb-row">
						<div class="qb-field">
							<label class="qb-field-label">Type</label>
							<select
								value={q.type}
								onchange={(e) => {
									const newType = e.currentTarget.value as 'text' | 'select' | 'checkbox';
									questions = questions.map((item, idx) =>
										idx === i ? { ...item, type: newType, options: newType === 'text' ? undefined : (item.options || []) } : item
									);
								}}
								class="qb-select"
							>
								<option value="text">Text</option>
								<option value="select">Dropdown</option>
								<option value="checkbox">Checkboxes</option>
							</select>
						</div>

						<label class="qb-checkbox">
							<input
								type="checkbox"
								checked={q.required}
								onchange={(e) => {
									questions = questions.map((item, idx) =>
										idx === i ? { ...item, required: e.currentTarget.checked } : item
									);
								}}
							/>
							Required
						</label>
					</div>

					{#if q.type === 'select' || q.type === 'checkbox'}
						<div class="qb-options">
							<label class="qb-field-label">Options</label>
							{#if q.options && q.options.length > 0}
								<div class="qb-option-list">
									{#each q.options as opt, oi}
										<span class="qb-option-tag">
											{opt}
											<button type="button" class="qb-option-remove" onclick={() => removeOption(q.id, oi)}>&times;</button>
										</span>
									{/each}
								</div>
							{/if}
							<div class="qb-option-add">
								<input
									type="text"
									placeholder="Add option..."
									bind:value={newOption[q.id]}
									onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOption(q.id); } }}
									class="qb-input qb-option-input"
								/>
								<button type="button" class="qb-option-btn" onclick={() => addOption(q.id)}>Add</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.qb-container {
		margin-top: 0.5rem;
	}

	.qb-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.qb-label {
		font-size: 0.8rem;
		font-weight: 500;
		color: #374151;
	}

	.qb-add-btn {
		padding: 0.3rem 0.7rem;
		background: none;
		border: 1px solid #d1d5db;
		color: #4f46e5;
		border-radius: 0.25rem;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
	}

	.qb-add-btn:hover { background: #f5f3ff; border-color: #c4b5fd; }

	.qb-empty {
		font-size: 0.8rem;
		color: #9ca3af;
		padding: 0.5rem 0;
	}

	.qb-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.qb-card {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.375rem;
		padding: 0.75rem;
	}

	.qb-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	.qb-num {
		font-size: 0.7rem;
		font-weight: 600;
		color: #4f46e5;
		text-transform: uppercase;
	}

	.qb-remove {
		background: none;
		border: none;
		color: #dc2626;
		font-size: 0.7rem;
		cursor: pointer;
		padding: 0.1rem 0.3rem;
	}

	.qb-remove:hover { text-decoration: underline; }

	.qb-field { margin-bottom: 0.5rem; }

	.qb-field-label {
		display: block;
		font-size: 0.7rem;
		font-weight: 500;
		color: #6b7280;
		margin-bottom: 0.2rem;
	}

	.qb-input {
		width: 100%;
		padding: 0.4rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		font-size: 0.8rem;
		color: #374151;
	}

	.qb-input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
	}

	.qb-select {
		padding: 0.4rem 0.6rem;
		border: 1px solid #d1d5db;
		border-radius: 0.25rem;
		font-size: 0.8rem;
		color: #374151;
		background: #fff;
	}

	.qb-row {
		display: flex;
		align-items: flex-end;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.qb-checkbox {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.8rem;
		color: #374151;
		cursor: pointer;
		white-space: nowrap;
		padding-bottom: 0.5rem;
	}

	.qb-checkbox input { accent-color: #4f46e5; }

	.qb-options { margin-top: 0.25rem; }

	.qb-option-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.4rem;
	}

	.qb-option-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.15rem 0.5rem;
		background: #eef2ff;
		color: #4f46e5;
		border-radius: 9999px;
		font-size: 0.7rem;
		font-weight: 500;
	}

	.qb-option-remove {
		background: none;
		border: none;
		color: #6366f1;
		font-size: 0.85rem;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}

	.qb-option-remove:hover { color: #dc2626; }

	.qb-option-add {
		display: flex;
		gap: 0.35rem;
	}

	.qb-option-input { flex: 1; }

	.qb-option-btn {
		padding: 0.35rem 0.6rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.7rem;
		cursor: pointer;
		white-space: nowrap;
	}

	.qb-option-btn:hover { background: #4338ca; }
</style>
