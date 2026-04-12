<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	import { renderMarkdown } from '$lib/utils/markdown';

	let { data } = $props();

	function parseList(key: string, fallback: any[]) {
		try {
			const val = data.content[key];
			if (!val) return fallback;
			return JSON.parse(val);
		} catch {
			return fallback;
		}
	}

	const displayContent = $derived(data.content);

	let faqOpen = $state<number | null>(null);

	function toggleFaq(index: number) {
		faqOpen = faqOpen === index ? null : index;
	}

	const faqs = $derived(parseList('faq-list', [
		{
			q: 'How do I pay my annual POA assessment?',
			a: 'You can pay your annual POA assessment securely online through our payment portal: <a href="https://smartpay.profitstars.com/express/MAYNEGAITE" target="_blank" rel="noopener noreferrer" class="text-mg-forest hover:underline font-medium">Pay Dues Here</a>. If you prefer to pay by mail, please contact the Treasurer, Joan Archie.'
		},
		{
			q: 'What exterior modifications require approval?',
			a: 'All exterior modifications — including fences, paint colors, landscaping changes, additions, and satellite dish placements — require approval from the Architectural Committee before work begins.'
		},
		{
			q: 'Where can I find the MPOA covenants and bylaws?',
			a: 'The full covenants and bylaws document is available on our Documents page. It details how our community works, including the makeup of our board and committees.'
		},
		{
			q: 'How do I sign up for CodeRED emergency alerts?',
			a: 'Visit the Village of Olympia Fields website to register for CodeRED. It sends alerts about emergency and non-emergency events via telephone, text, and email.'
		},
		{
			q: 'When is branch pickup in Maynegaite?',
			a: 'Maynegaite (East side) receives municipal branch pickup on the 1st and 3rd Tuesday of every month, weather permitting.'
		},
		{
			q: 'Are "For Sale" signs allowed?',
			a: '"For Sale" signs are not permitted within the subdivision per MPOA covenants. Please review the covenant documents for full details.'
		},
		{
			q: 'How do I contact the MPOA Board?',
			a: 'You can reach the board through our Contact page or attend one of the regularly scheduled board meetings.'
		}
	]));

	const resourceCards = $derived(parseList('resource-grid', [
		{
			title: 'Special Events & Announcements',
			description: 'Stay informed about upcoming community events, social gatherings, and important MPOA announcements.',
			link: '/events',
			linkText: 'View Events →',
			icon: 'star'
		},
		{
			title: 'MPOA Assessment Increase',
			description: 'Important announcement regarding changes to the MPOA assessment. Please review the details.',
			link: '/documents',
			linkText: 'View Details →',
			icon: 'warning'
		},
		{
			title: 'Board Meeting Notes',
			description: 'Access minutes and notes from MPOA board meetings to stay up to date on community decisions.',
			link: '/documents',
			linkText: 'View Notes →',
			icon: 'doc'
		},
		{
			title: 'Sign Up for CodeRED',
			description: 'CodeRED sends alerts about emergency and non-emergency events via telephone, text, and email. Sign up today!',
			link: 'https://www.olympia-fields.com',
			linkText: 'Sign Up →',
			icon: 'emergency',
			isPremium: true
		},
		{
			title: 'Covenants & Bylaws',
			description: 'This document details how our community works, including the makeup of our board and committees.',
			link: '/documents',
			linkText: 'View Documents →',
			icon: 'doc'
		},
		{
			title: 'Village of Olympia Fields',
			description: 'Access village services, public meeting schedules, and municipal resources.',
			link: 'https://www.olympia-fields.com',
			linkText: 'View Meeting Schedule →',
			icon: 'house'
		}
	]));

	const villageResources = $derived(parseList('village-resources', [
		{ label: 'Village Website', url: 'https://www.olympia-fields.com', icon: 'globe' },
		{ label: 'Public Meeting Schedule', url: 'https://www.olympia-fields.com', icon: 'calendar' },
		{ label: 'Olympia Fields Park District', url: 'https://ofparks.org', icon: 'users' },
		{ label: 'MPOA Documents & Minutes', url: '/documents', icon: 'doc' }
	]));
</script>

<SEO title="Owner Resources" description="Essential resources and links for Maynegaite homeowners — board directors, meeting notes, assessments, and community information." />

<div class="py-16 px-4">
	<div class="max-w-5xl mx-auto">
		<!-- Page Header -->
		<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium">Homeowner Hub</p>
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mt-2 mb-2">{displayContent['page-title'] || 'Owner Resources'}</h1>
		<p class="text-lg text-mg-warmGray mb-12">{displayContent['page-description'] || 'Essential tools, announcements, and information for Maynegaite homeowners.'}</p>

		<!-- Board Directors -->
		<section class="mb-12">
			<h2 class="font-display text-2xl font-bold text-mg-charcoal mb-2">{displayContent['board-title'] || 'MPOA Board — Newly Elected Officials'}</h2>
			<p class="text-sm text-mg-warmGray mb-5">{displayContent['board-description'] || 'Meet your recently elected board directors.'}</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				{#each data.officers as officer}
					<div class="card-premium flex items-center gap-4">
						{#if officer.imageUrl}
							<img src={officer.imageUrl} alt={officer.name} class="shrink-0 w-12 h-12 rounded-full object-cover" />
						{:else}
							<div class="shrink-0 w-12 h-12 rounded-full bg-mg-forest flex items-center justify-center">
								<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
								</svg>
							</div>
						{/if}
						<div>
							<p class="font-semibold text-mg-charcoal text-lg">{officer.name}</p>
							<p class="text-sm text-mg-gold font-medium">{officer.position}</p>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- Main Resource Grid -->
		<section class="mb-12">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
				{#each resourceCards as card}
					<div class="card-elevated hover-lift {card.icon === 'warning' ? 'border-l-4 border-mg-gold' : ''} {card.isPremium ? 'card-premium' : ''}">
						<div class="flex items-center gap-3 mb-3">
							<div class="shrink-0 w-10 h-10 rounded-full flex items-center justify-center
								{card.icon === 'star' ? 'bg-mg-gold/15 text-mg-gold' : 
								 card.icon === 'warning' ? 'bg-amber-100 text-amber-600' :
								 card.icon === 'emergency' ? 'bg-red-100 text-red-600' :
								 'bg-mg-forest/10 text-mg-forest'}">
								
								{#if card.icon === 'star'}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
								{:else if card.icon === 'warning'}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
								{:else if card.icon === 'emergency'}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
								{:else if card.icon === 'doc'}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
								{:else if card.icon === 'house'}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
								{:else}
									<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="8" /></svg>
								{/if}
							</div>
							<h3 class="font-semibold text-mg-charcoal text-base">{card.title}</h3>
						</div>
						<p class="text-sm text-mg-warmGray mb-3">{card.description}</p>
						{#if card.link.startsWith('http')}
							<a href={card.link} target="_blank" rel="noopener noreferrer" class="{card.isPremium ? 'btn-primary text-sm' : 'text-sm text-mg-forest font-medium hover:underline'}">
								{card.linkText}
							</a>
						{:else}
							<a href={card.link} class="text-sm text-mg-forest font-medium hover:underline">{card.linkText}</a>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<!-- Pay Assessments & Contact -->
		<section class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
			<!-- Pay Annual Assessments -->
			<div class="card-premium">
				<div class="flex items-center gap-3 mb-3">
					<div class="shrink-0 w-10 h-10 rounded-full bg-mg-forest flex items-center justify-center">
						<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
						</svg>
					</div>
					<h3 class="font-semibold text-mg-charcoal text-lg">Pay Annual Assessments</h3>
				</div>
				<div class="bg-mg-stone/10 border border-mg-stone/50 rounded-lg p-4 mb-4">
					<p class="text-sm text-mg-charcoal mb-4">
						Pay your annual POA assessments securely online using our payment portal.
					</p>
					<a href="https://smartpay.profitstars.com/express/MAYNEGAITE" target="_blank" rel="noopener noreferrer" class="btn-primary w-full justify-center">
						Pay Dues Online
					</a>
				</div>
				<p class="text-sm text-mg-warmGray">If you need to pay by mail, please contact the Treasurer for instructions.</p>
			</div>

			<!-- Resident Contact Information -->
			<div class="card-elevated">
				<div class="flex items-center gap-3 mb-3">
					<div class="shrink-0 w-10 h-10 rounded-full bg-mg-forest/10 flex items-center justify-center">
						<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
						</svg>
					</div>
					<h3 class="font-semibold text-mg-charcoal text-lg">Resident Contact Information</h3>
				</div>
				<p class="text-sm text-mg-warmGray mb-3">Need to get in touch with the board or update your contact information? We're here to help.</p>
				<a href="/contact" class="btn-secondary text-sm">Contact the Board →</a>
			</div>
		</section>

		<!-- Village Resources -->
		<section class="card-subtle mb-12">
			<h2 class="font-display text-xl font-bold text-mg-charcoal mb-4">Village of Olympia Fields Resources</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{#each villageResources as res}
					<a href={res.url} target={res.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" class="flex items-center gap-3 p-3 rounded-lg hover:bg-mg-stone/30 transition-colors no-underline group">
						{#if res.icon === 'globe'}
							<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
						{:else if res.icon === 'calendar'}
							<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
						{:else if res.icon === 'users'}
							<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
						{:else if res.icon === 'doc'}
							<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
						{:else}
							<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="8" /></svg>
						{/if}
						<span class="text-sm text-mg-charcoal group-hover:text-mg-forest transition-colors">{res.label}</span>
					</a>
				{/each}
			</div>
		</section>

		<!-- FAQs -->
		<section class="mb-12">
			<h2 class="font-display text-2xl font-bold text-mg-charcoal mb-2">{displayContent['faq-title'] || 'Frequently Asked Questions'}</h2>
			<p class="text-sm text-mg-warmGray mb-6">{displayContent['faq-description'] || 'Common questions from Maynegaite homeowners.'}</p>
			<div class="space-y-2">
				{#each faqs as faq, i}
					<div class="border border-mg-stone rounded-lg overflow-hidden bg-white">
						<button
							type="button"
							class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-mg-ivory/50 transition-colors"
							onclick={() => toggleFaq(i)}
							aria-expanded={faqOpen === i}
						>
							<span class="font-medium text-mg-charcoal text-sm pr-4">{faq.q}</span>
							<svg
								class="w-4 h-4 text-mg-warmGray shrink-0 transition-transform duration-200"
								class:rotate-180={faqOpen === i}
								fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"
							>
								<polyline points="6 9 12 15 18 9" />
							</svg>
						</button>
						{#if faqOpen === i}
							<div class="px-5 pb-4 text-sm text-mg-warmGray border-t border-mg-stone/50">
								<p class="pt-3">{@html faq.a}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<!-- Community Reminders -->
		<section class="card-subtle mb-12">
			<h2 class="font-display text-xl font-bold text-mg-charcoal mb-4">Community Reminders</h2>
			<div class="prose prose-sm text-mg-charcoal prose-strong:text-mg-charcoal prose-ul:list-disc">
				{@html renderMarkdown(displayContent['reminders'] || '- "For Sale" signs are **not permitted** within the subdivision.\n- All exterior modifications require Architectural Committee approval.\n- The Village offers a **$2,000 annual grant**.\n- Keep your property maintained.')}
			</div>
		</section>

		<!-- Additional Content -->
		{#if displayContent['additional-content']}
			<section class="mb-12 prose prose-mg max-w-none">
				{@html renderMarkdown(displayContent['additional-content'])}
			</section>
		{/if}
	</div>
</div>
