<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';

	let { data } = $props();
	const officer = $derived(data.officer);
	const initials = $derived(
		officer.name
			.split(' ')
			.map((n: string) => n[0])
			.join('')
	);
</script>

<SEO
	title="{officer.name} — {officer.position}"
	description="{officer.name}, {officer.position} of the Maynegaite Property Owners' Association."
/>

<div class="min-h-screen bg-mg-ivory px-4 py-12">
	<div class="mx-auto max-w-2xl">
		<div class="card-elevated">
			<div class="mb-6 flex flex-col items-center text-center">
				{#if officer.imageUrl}
					<img
						src={officer.imageUrl}
						alt={officer.name}
						class="mb-4 h-40 w-40 rounded-full object-cover"
					/>
				{:else}
					<div class="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-mg-forest/10">
						<span class="font-display text-5xl font-bold text-mg-forest">{initials}</span>
					</div>
				{/if}

				<h1 class="font-display text-3xl font-bold text-mg-charcoal">{officer.name}</h1>
				<p class="mt-1 font-medium text-mg-gold">{officer.position}</p>

				{#if officer.email}
					<a href="mailto:{officer.email}" class="mt-2 text-sm text-mg-forest hover:underline">
						{officer.email}
					</a>
				{/if}
			</div>

			{#if officer.bio}
				<div class="border-t border-mg-stone pt-6">
					<p class="whitespace-pre-wrap leading-relaxed text-mg-charcoal">{officer.bio}</p>
				</div>
			{/if}
		</div>

		<div class="mt-6 text-center">
			<a href="/board" class="text-sm text-mg-forest hover:underline">&larr; Back to Board</a>
		</div>
	</div>
</div>
