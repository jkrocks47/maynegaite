<script lang="ts">
	import EventCalendar from '$lib/components/shared/EventCalendar.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Maynegaite POA | Olympia Fields, Illinois</title>
	<meta name="description" content="Maynegaite Property Owners' Association — an established residential community in Olympia Fields, Illinois." />
</svelte:head>

<!-- Hero Section -->
<section class="bg-mg-forest text-white py-20 px-4">
	<div class="max-w-4xl mx-auto text-center">
		<h1 class="font-display text-5xl md:text-6xl font-bold mb-4">Welcome to Maynegaite</h1>
		<p class="text-xl text-white/80 max-w-2xl mx-auto mb-8">
			An established residential community in Olympia Fields, Illinois — where neighbors become family.
		</p>
		<a href="/events" class="inline-block bg-mg-gold hover:bg-mg-goldDark text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg">
			View Events
		</a>
	</div>
</section>

<!-- Quick Links -->
<section class="py-16 px-4 bg-mg-ivory">
	<div class="max-w-5xl mx-auto">
		<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mb-10">Homeowner Resources</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{#if data.communityInfo?.paymentUrl}
				<a href={data.communityInfo.paymentUrl} target="_blank" rel="noopener noreferrer" class="card-elevated hover-lift text-center py-8 px-6 no-underline">
					<div class="text-3xl mb-3">💳</div>
					<h3 class="font-semibold text-mg-charcoal text-lg">Pay Dues</h3>
					<p class="text-sm text-mg-warmGray mt-1">Make your HOA payment</p>
				</a>
			{/if}
			<a href="/events" class="card-elevated hover-lift text-center py-8 px-6 no-underline">
				<div class="text-3xl mb-3">📅</div>
				<h3 class="font-semibold text-mg-charcoal text-lg">Community Events</h3>
				<p class="text-sm text-mg-warmGray mt-1">Upcoming activities and meetings</p>
			</a>
			<a href="/board" class="card-elevated hover-lift text-center py-8 px-6 no-underline">
				<div class="text-3xl mb-3">👥</div>
				<h3 class="font-semibold text-mg-charcoal text-lg">Board of Directors</h3>
				<p class="text-sm text-mg-warmGray mt-1">Meet your community leaders</p>
			</a>
			<a href="/gallery" class="card-elevated hover-lift text-center py-8 px-6 no-underline">
				<div class="text-3xl mb-3">📸</div>
				<h3 class="font-semibold text-mg-charcoal text-lg">Photo Gallery</h3>
				<p class="text-sm text-mg-warmGray mt-1">Community photos and events</p>
			</a>
			<a href="/documents" class="card-elevated hover-lift text-center py-8 px-6 no-underline">
				<div class="text-3xl mb-3">📄</div>
				<h3 class="font-semibold text-mg-charcoal text-lg">Documents</h3>
				<p class="text-sm text-mg-warmGray mt-1">Bylaws, covenants, and minutes</p>
			</a>
			<a href="/contact" class="card-elevated hover-lift text-center py-8 px-6 no-underline">
				<div class="text-3xl mb-3">✉️</div>
				<h3 class="font-semibold text-mg-charcoal text-lg">Contact Us</h3>
				<p class="text-sm text-mg-warmGray mt-1">Reach the MPOA board</p>
			</a>
		</div>
	</div>
</section>

<!-- Announcements -->
{#if data.recentAnnouncements && data.recentAnnouncements.length > 0}
	<section class="py-16 px-4 bg-mg-parchment">
		<div class="max-w-4xl mx-auto">
			<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mb-10">Community News</h2>
			<div class="space-y-4">
				{#each data.recentAnnouncements as announcement}
					<div class="card-elevated">
						<div class="flex items-start justify-between gap-4">
							<div>
								{#if announcement.isPinned}
									<span class="badge badge-gold mb-2">Pinned</span>
								{/if}
								<h3 class="font-semibold text-mg-charcoal text-lg">{announcement.title}</h3>
								<p class="text-mg-warmGray mt-2 line-clamp-3">{announcement.body}</p>
							</div>
							<span class="text-xs text-mg-warmGray whitespace-nowrap">
								{announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Upcoming Events Calendar -->
{#if data.upcomingEvents && data.upcomingEvents.length > 0}
	<section class="py-16 px-4 bg-mg-ivory">
		<div class="max-w-5xl mx-auto">
			<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mb-10">Upcoming Events</h2>
			<EventCalendar
				events={data.upcomingEvents}
				isLoggedIn={data.isLoggedIn}
				isVerified={data.isVerified}
			/>
		</div>
	</section>
{/if}

<!-- About Section -->
<section class="py-16 px-4 bg-mg-parchment">
	<div class="max-w-3xl mx-auto text-center">
		<h2 class="font-display text-3xl font-bold text-mg-charcoal mb-6">About Our Community</h2>
		<p class="text-mg-charcoal leading-relaxed text-lg">
			{data.communityInfo?.aboutText ?? "Maynegaite is a premier residential subdivision in Olympia Fields, Illinois, governed by the Maynegaite Property Owners' Association (MPOA). Our community encompasses 197 residential lots across Maynegaite Woods and The Reserves, offering a blend of spacious single-family estates and modern luxury townhomes."}
		</p>
		<a href="/about" class="btn-primary mt-8 inline-block">Learn More</a>
	</div>
</section>
