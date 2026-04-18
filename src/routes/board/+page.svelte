<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	let { data } = $props();
</script>

<SEO
	title="Board of Directors"
	description="Meet the dedicated professionals who govern the Maynegaite Property Owners' Association."
/>

<div class="px-4 py-16">
	<div class="mx-auto max-w-4xl">
		<h1 class="mb-4 font-display text-4xl font-bold text-mg-charcoal">Board of Directors</h1>
		<p class="mb-12 text-lg text-mg-warmGray">
			Meet the dedicated professionals who govern the Maynegaite Property Owners' Association.
		</p>

		<div class="mb-12 grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2">
			{#each data.officers as officer}
				<a
					href="/board/{officer.id}"
					class="card-premium hover-lift flex h-full flex-col text-inherit no-underline"
				>
					<div class="flex items-start gap-4">
						{#if officer.imageUrl}
							<img
								src={officer.imageUrl.startsWith('/api/images/')
									? `${officer.imageUrl}?variant=thumbnail`
									: officer.imageUrl}
								alt={officer.name}
								class="h-20 w-20 flex-shrink-0 rounded-full object-cover"
							/>
						{:else}
							<div
								class="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-mg-forest/10"
							>
								<span class="font-display text-2xl font-bold text-mg-forest">
									{officer.name
										.split(' ')
										.map((n: string) => n[0])
										.join('')}
								</span>
							</div>
						{/if}
						<div class="min-w-0">
							<h3 class="text-lg font-semibold text-mg-charcoal">{officer.name}</h3>
							<p class="text-sm font-medium text-mg-gold">{officer.position}</p>
						</div>
					</div>
					{#if officer.bio}
						<p class="mt-3 line-clamp-2 text-sm leading-relaxed text-mg-warmGray">{officer.bio}</p>
					{/if}
					<span class="mt-auto pt-3 text-sm font-medium text-mg-forest">Read bio &rarr;</span>
				</a>
			{/each}
		</div>

		<!-- Meeting Info -->
		{#if data.communityInfo?.meetingInfo}
			<section class="card-elevated">
				<h2 class="mb-3 font-display text-2xl font-bold text-mg-charcoal">Board Meetings</h2>
				<p class="leading-relaxed text-mg-charcoal">{data.communityInfo.meetingInfo}</p>
			</section>
		{/if}
	</div>
</div>
