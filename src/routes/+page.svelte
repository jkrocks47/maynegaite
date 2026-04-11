<script lang="ts">
	import EventCalendar from '$lib/components/shared/EventCalendar.svelte';
	import ScrollReveal from '$lib/components/community/ScrollReveal.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Maynegaite POA | Olympia Fields, Illinois</title>
	<meta name="description" content="Maynegaite Property Owners' Association — a premier residential community in Olympia Fields, Illinois, where African-American excellence and elegant living converge." />
</svelte:head>

<!-- Hero: Split Layout -->
<section class="relative bg-mg-forest overflow-hidden min-h-[540px] md:min-h-[580px]">

	<!-- Photo: absolute on desktop (right half), inline on mobile -->
	<div class="md:hidden h-56 w-full overflow-hidden">
		<img src="/maynegaite-entrance.webp" alt="Maynegaite entrance" class="w-full h-full object-cover object-center" />
	</div>
	<div class="hidden md:block absolute inset-y-0 right-0 w-1/2 overflow-hidden" aria-hidden="false">
		<img src="/maynegaite-entrance.webp" alt="Maynegaite entrance" class="w-full h-full object-cover object-center" />
		<!-- Fade into green panel -->
		<div class="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-mg-forest to-transparent pointer-events-none" aria-hidden="true"></div>
	</div>

	<!-- Inner wrapper: same max-width & padding as the nav — aligns left edge of text with the rest of the site -->
	<div class="relative max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:min-h-[580px]">
		<!-- Text panel (left half) -->
		<div class="md:w-1/2 text-white flex flex-col justify-center py-16 md:py-24 md:pr-12">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium">Olympia Fields, Illinois</p>
			<hr class="border-t border-mg-gold/40 w-16 my-4" />
			<h1 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
				Welcome Home<br />to Maynegaite.
			</h1>
			<p class="font-display italic text-lg text-white/75 mt-5 max-w-sm">
				A premier residential community where African-American excellence,
				homeownership pride, and elegant living have defined Olympia Fields for over five decades.
			</p>
			<div class="flex flex-wrap gap-3 mt-8">
				<a href="/events" class="btn-gold">View Community Events</a>
				<a href="/about" class="btn-secondary" style="color:white;border-color:rgba(255,255,255,0.4)">Our Story</a>
			</div>
			<div class="mt-10 flex flex-wrap gap-x-5 gap-y-2 text-white/40 text-xs uppercase tracking-widest">
				<span>197 Residential Lots</span>
				<span class="text-mg-gold/30">·</span>
				<span>Est. Late 1970s</span>
				<span class="text-mg-gold/30">·</span>
				<span>Top 5% U.S. Income</span>
				<span class="text-mg-gold/30">·</span>
				<span>100% College Acceptance (Southland College Prep HS)</span>
			</div>
		</div>
		<!-- Spacer: holds the right half open for the absolute photo -->
		<div class="hidden md:block md:w-1/2" aria-hidden="true"></div>
	</div>

</section>

<!-- Community Portal -->
<section class="py-20 px-4 bg-mg-ivory">
	<ScrollReveal>
		<div class="max-w-5xl mx-auto">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Resident Portal</p>
			<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mt-2 mb-10">
				Everything You Need
			</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

				<a href={data.communityInfo?.paymentUrl || 'https://smartpay.profitstars.com/express/MAYNEGAITE'} target="_blank" rel="noopener noreferrer"
					class="card-premium hover-lift flex items-start gap-4 no-underline group">
					<div class="shrink-0 w-11 h-11 rounded-full bg-mg-forest flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
							<line x1="1" y1="10" x2="23" y2="10"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-mg-charcoal text-base group-hover:text-mg-forest transition-colors">Pay Dues</h3>
						<p class="text-sm text-mg-warmGray mt-0.5">Make your HOA assessment payment</p>
					</div>
				</a>

				<a href="/events" class="card-elevated hover-lift flex items-start gap-4 no-underline group">
					<div class="shrink-0 w-11 h-11 rounded-full bg-mg-forest/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
							<line x1="16" y1="2" x2="16" y2="6"/>
							<line x1="8" y1="2" x2="8" y2="6"/>
							<line x1="3" y1="10" x2="21" y2="10"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-mg-charcoal text-base group-hover:text-mg-forest transition-colors">Community Events</h3>
						<p class="text-sm text-mg-warmGray mt-0.5">Upcoming activities and meetings</p>
					</div>
				</a>

				<a href="/board" class="card-elevated hover-lift flex items-start gap-4 no-underline group">
					<div class="shrink-0 w-11 h-11 rounded-full bg-mg-forest/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
							<circle cx="9" cy="7" r="4"/>
							<path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
							<path d="M16 3.13a4 4 0 0 1 0 7.75"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-mg-charcoal text-base group-hover:text-mg-forest transition-colors">Board of Directors</h3>
						<p class="text-sm text-mg-warmGray mt-0.5">Meet your community leaders</p>
					</div>
				</a>

				<a href="/gallery" class="card-elevated hover-lift flex items-start gap-4 no-underline group">
					<div class="shrink-0 w-11 h-11 rounded-full bg-mg-forest/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
							<circle cx="8.5" cy="8.5" r="1.5"/>
							<polyline points="21 15 16 10 5 21"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-mg-charcoal text-base group-hover:text-mg-forest transition-colors">Photo Gallery</h3>
						<p class="text-sm text-mg-warmGray mt-0.5">Community photos and events</p>
					</div>
				</a>

				<a href="/documents" class="card-elevated hover-lift flex items-start gap-4 no-underline group">
					<div class="shrink-0 w-11 h-11 rounded-full bg-mg-forest/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
							<polyline points="14 2 14 8 20 8"/>
							<line x1="16" y1="13" x2="8" y2="13"/>
							<line x1="16" y1="17" x2="8" y2="17"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-mg-charcoal text-base group-hover:text-mg-forest transition-colors">Documents</h3>
						<p class="text-sm text-mg-warmGray mt-0.5">Bylaws, covenants, and minutes</p>
					</div>
				</a>

				<a href="/contact" class="card-elevated hover-lift flex items-start gap-4 no-underline group">
					<div class="shrink-0 w-11 h-11 rounded-full bg-mg-forest/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
							<polyline points="22,6 12,13 2,6"/>
						</svg>
					</div>
					<div>
						<h3 class="font-semibold text-mg-charcoal text-base group-hover:text-mg-forest transition-colors">Contact Us</h3>
						<p class="text-sm text-mg-warmGray mt-0.5">Reach the MPOA board</p>
					</div>
				</a>

			</div>
		</div>
	</ScrollReveal>
</section>

<!-- Announcements -->
{#if data.recentAnnouncements && data.recentAnnouncements.length > 0}
	<section class="py-20 px-4 bg-mg-parchment paper-texture">
		<ScrollReveal>
			<div class="max-w-4xl mx-auto">
				<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Stay Informed</p>
				<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mt-2 mb-10">Community News</h2>
				<div class="space-y-4">
					{#each data.recentAnnouncements as announcement}
						<div class="card-elevated {announcement.isPinned ? 'border-l-4 border-mg-gold' : ''}">
							<div class="flex items-start justify-between gap-4">
								<div class="flex-1 min-w-0">
									{#if announcement.isPinned}
										<span class="badge badge-gold mb-2">Pinned</span>
									{/if}
									<h3 class="font-semibold text-mg-charcoal text-lg">{announcement.title}</h3>
									<p class="text-mg-warmGray mt-2 line-clamp-3">{announcement.body}</p>
								</div>
								<span class="shrink-0 text-xs text-mg-warmGray bg-mg-stone/50 px-2 py-1 rounded-md">
									{announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</ScrollReveal>
	</section>
{/if}

<!-- Upcoming Events -->
{#if data.upcomingEvents && data.upcomingEvents.length > 0}
	<section class="py-20 px-4 bg-mg-ivory">
		<ScrollReveal>
			<div class="max-w-5xl mx-auto">
				<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Mark Your Calendar</p>
				<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mt-2 mb-10">Upcoming Events</h2>
				<EventCalendar
					events={data.upcomingEvents}
					isLoggedIn={data.isLoggedIn}
				/>
			</div>
		</ScrollReveal>
	</section>
{/if}

<!-- Community Identity CTA -->
<section class="bg-mg-forest py-24 px-4">
	<div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
		<div>
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium">About Our Community</p>
			<hr class="border-t border-mg-gold/40 w-16 my-4" />
			<h2 class="font-display text-4xl font-bold text-white leading-tight">
				One of the most distinguished communities in Illinois.
			</h2>
			<p class="text-white/70 mt-4 leading-relaxed">
				{data.communityInfo?.aboutText ?? "Maynegaite encompasses 197 residential lots across Maynegaite Woods and The Reserves — a blend of spacious single-family estates and modern luxury townhomes, anchored by five decades of homeownership pride."}
			</p>
		</div>
		<div class="flex flex-col gap-4 md:items-start">
			<div class="card-subtle bg-white/10 border-white/20 w-full" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15)">
				<p class="font-display text-3xl font-bold text-mg-gold">78%</p>
				<p class="text-sm text-white/60 mt-1">African-American homeownership — among the highest nationally for majority-Black communities</p>
			</div>
			<div class="card-subtle w-full" style="background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.15)">
				<p class="font-display text-3xl font-bold text-mg-gold">Top 5%</p>
				<p class="text-sm text-white/60 mt-1">Median household income in the United States — zip code 60461</p>
			</div>
			<a href="/about" class="btn-gold mt-2">Learn Our Story →</a>
		</div>
	</div>
</section>
