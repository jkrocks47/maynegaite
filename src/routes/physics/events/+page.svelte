<script lang="ts">
	import { formatDate } from '$lib/utils/dates';

	let { data } = $props();
</script>

<svelte:head>
	<title>Events | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-12">
			<p class="font-body text-sm tracking-widest text-physics-blue/70 uppercase mb-2">Schedule</p>
			<h1 class="font-display text-4xl sm:text-5xl font-bold tracking-tight text-physics-dark">
				Upcoming Events
			</h1>
			<div class="mt-4 w-16 h-0.5 bg-physics-blue/30"></div>
		</div>

		<!-- Events List -->
		{#if data.events.length === 0}
			<div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
				<p class="font-body text-sm text-physics-dark/40">No upcoming events. Check back soon.</p>
			</div>
		{:else}
			<div class="flex flex-col gap-4">
				{#each data.events as event}
					<div class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-physics-blue/20 transition-all duration-300">
						<div class="flex flex-col sm:flex-row">
							{#if event.imageUrl}
								<div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
									<img
										src={event.imageUrl}
										alt={event.title}
										class="w-full h-full object-cover"
									/>
								</div>
							{/if}
							<div class="p-6 flex-1">
								<p class="font-body text-xs text-physics-blue font-medium mb-2">
									{formatDate(event.date)}
									{#if event.time}
										<span class="text-physics-dark/30 mx-1">/</span>
										{event.time}
									{/if}
								</p>
								<h2 class="font-display text-xl font-bold text-physics-dark mb-2">
									{event.title}
								</h2>
								{#if event.location}
									<p class="font-body text-sm text-physics-dark/50 mb-3">{event.location}</p>
								{/if}
								{#if event.description}
									<p class="font-body text-sm text-physics-dark/60 line-clamp-2">{event.description}</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
