<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	let { data } = $props();
</script>

<SEO title="Board of Directors" description="Meet the dedicated professionals who govern the Maynegaite Property Owners' Association." />

<div class="py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mb-4">Board of Directors</h1>
		<p class="text-lg text-mg-warmGray mb-12">Meet the dedicated professionals who govern the Maynegaite Property Owners' Association.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
			{#each data.officers as officer}
				<div class="card-premium hover-lift">
					<div class="flex items-start gap-4">
						{#if officer.imageUrl}
							<img src={officer.imageUrl} alt={officer.name} class="w-20 h-20 rounded-full object-cover flex-shrink-0" />
						{:else}
							<div class="w-20 h-20 rounded-full bg-mg-forest/10 flex items-center justify-center flex-shrink-0">
								<span class="font-display text-2xl font-bold text-mg-forest">
									{officer.name.split(' ').map((n: string) => n[0]).join('')}
								</span>
							</div>
						{/if}
						<div>
							<h3 class="font-semibold text-mg-charcoal text-lg">{officer.name}</h3>
							<p class="text-sm text-mg-gold font-medium mb-2">{officer.position}</p>
							{#if officer.bio}
								<p class="text-sm text-mg-warmGray leading-relaxed">{officer.bio}</p>
							{/if}
							{#if officer.email}
								<a href="mailto:{officer.email}" class="text-sm text-mg-forest hover:underline mt-2 inline-block">{officer.email}</a>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Meeting Info -->
		{#if data.communityInfo?.meetingInfo}
			<section class="card-elevated">
				<h2 class="font-display text-2xl font-bold text-mg-charcoal mb-3">Board Meetings</h2>
				<p class="text-mg-charcoal leading-relaxed">{data.communityInfo.meetingInfo}</p>
			</section>
		{/if}
	</div>
</div>
