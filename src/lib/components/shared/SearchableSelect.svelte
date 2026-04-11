<script lang="ts">
	let {
		id,
		name,
		options = [],
		value = $bindable(),
		placeholder = 'Select...',
		required = false,
		class: className = ''
	}: {
		id?: string;
		name: string;
		options: { value: string; label: string }[];
		value?: string;
		placeholder?: string;
		required?: boolean;
		class?: string;
	} = $props();

	let searchQuery = $state('');
	let isOpen = $state(false);
	let selectContainer: HTMLElement;

	$effect(() => {
		if (value) {
			const selectedOption = options.find((o) => o.value === value);
			if (selectedOption && !isOpen) {
				searchQuery = selectedOption.label;
			}
		} else if (!isOpen) {
			searchQuery = '';
		}
	});

	let actualFilteredOptions = $derived(
		isOpen ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase())) : options
	);

	function handleSelect(option: { value: string; label: string }) {
		value = option.value;
		searchQuery = option.label;
		isOpen = false;
	}

	function onWindowClick(e: MouseEvent) {
		if (isOpen && selectContainer && !selectContainer.contains(e.target as Node)) {
			isOpen = false;
			const selectedOption = options.find((o) => o.value === value);
			searchQuery = selectedOption ? selectedOption.label : '';
		}
	}
</script>

<svelte:window onclick={onWindowClick} />

<div class="relative w-full" bind:this={selectContainer}>
	<input type="hidden" {name} bind:value />
	<!-- Native validation constraint works best if the hidden input requires it, but unfortunately hidden inputs don't do native validation UI well. 
	     However, server-side will enforce it. -->
	<input
		type="text"
		{id}
		bind:value={searchQuery}
		{placeholder}
		{required}
		class={className || 'input w-full'}
		onfocus={() => {
			isOpen = true;
			searchQuery = ''; 
		}}
		oninput={() => {
			// If they start typing, remove the hidden value so it requires re-selection if required
			if (isOpen) {
				value = '';
			}
		}}
	/>
	
	<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-mg-warmGray">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</div>

	{#if isOpen}
		<ul
			class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
		>
			{#if actualFilteredOptions.length === 0}
				<li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
					No options found
				</li>
			{:else}
				{#each actualFilteredOptions as option}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<li
						class="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-mg-forest hover:text-white {value === option.value ? 'bg-mg-stone/20 text-mg-charcoal font-medium' : 'text-mg-charcoal'}"
						onclick={(e) => {
							e.stopPropagation();
							handleSelect(option);
						}}
					>
						<span class="block truncate">{option.label}</span>
					</li>
				{/each}
			{/if}
		</ul>
	{/if}
</div>
