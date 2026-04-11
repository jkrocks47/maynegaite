<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';

	let faqOpen = $state<number | null>(null);

	function toggleFaq(index: number) {
		faqOpen = faqOpen === index ? null : index;
	}

	const faqs = [
		{
			q: 'How do I pay my annual HOA assessment?',
			a: 'The online payment portal is currently under construction. In the meantime, please contact the Treasurer, Joan Archie, for payment instructions and mailing addresses.'
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
	];
</script>

<SEO title="Owner Resources" description="Essential resources and links for Maynegaite homeowners — board directors, meeting notes, assessments, and community information." />

<div class="py-16 px-4">
	<div class="max-w-5xl mx-auto">
		<!-- Page Header -->
		<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium">Homeowner Hub</p>
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mt-2 mb-2">Owner Resources</h1>
		<p class="text-lg text-mg-warmGray mb-12">Essential tools, announcements, and information for Maynegaite homeowners.</p>

		<!-- Board Directors -->
		<section class="mb-12">
			<h2 class="font-display text-2xl font-bold text-mg-charcoal mb-2">MPOA Board — Newly Elected Officials</h2>
			<p class="text-sm text-mg-warmGray mb-5">Meet your recently elected board directors.</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="card-premium flex items-center gap-4">
					<div class="shrink-0 w-12 h-12 rounded-full bg-mg-forest flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
						</svg>
					</div>
					<div>
						<p class="font-semibold text-mg-charcoal text-lg">Cornell Hughes</p>
						<p class="text-sm text-mg-gold font-medium">Vice President</p>
					</div>
				</div>
				<div class="card-premium flex items-center gap-4">
					<div class="shrink-0 w-12 h-12 rounded-full bg-mg-forest flex items-center justify-center">
						<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
						</svg>
					</div>
					<div>
						<p class="font-semibold text-mg-charcoal text-lg">Joan Archie</p>
						<p class="text-sm text-mg-gold font-medium">Treasurer</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Main Resource Grid -->
		<section class="mb-12">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

				<!-- Special Events & Announcements -->
				<div class="card-elevated hover-lift">
					<div class="flex items-center gap-3 mb-3">
						<div class="shrink-0 w-10 h-10 rounded-full bg-mg-gold/15 flex items-center justify-center">
							<svg class="w-5 h-5 text-mg-gold" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
								<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
							</svg>
						</div>
						<h3 class="font-semibold text-mg-charcoal text-base">Special Events & Announcements</h3>
					</div>
					<p class="text-sm text-mg-warmGray mb-3">Stay informed about upcoming community events, social gatherings, and important MPOA announcements.</p>
					<a href="/events" class="text-sm text-mg-forest font-medium hover:underline">View Events →</a>
				</div>

				<!-- MPOA Assessment Increase -->
				<div class="card-elevated hover-lift border-l-4 border-mg-gold">
					<div class="flex items-center gap-3 mb-3">
						<div class="shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
							<svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
							</svg>
						</div>
						<h3 class="font-semibold text-mg-charcoal text-base">MPOA Assessment Increase</h3>
					</div>
					<p class="text-sm text-mg-warmGray mb-3">Important announcement regarding changes to the MPOA assessment. Please review the details.</p>
					<a href="/documents" class="text-sm text-mg-forest font-medium hover:underline">View Details →</a>
				</div>

				<!-- MPOA Board Meeting Notes -->
				<div class="card-elevated hover-lift">
					<div class="flex items-center gap-3 mb-3">
						<div class="shrink-0 w-10 h-10 rounded-full bg-mg-forest/10 flex items-center justify-center">
							<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
							</svg>
						</div>
						<h3 class="font-semibold text-mg-charcoal text-base">Board Meeting Notes</h3>
					</div>
					<p class="text-sm text-mg-warmGray mb-3">Access minutes and notes from MPOA board meetings to stay up to date on community decisions.</p>
					<a href="/documents" class="text-sm text-mg-forest font-medium hover:underline">View Notes →</a>
				</div>

				<!-- CodeRED -->
				<div class="card-premium hover-lift">
					<div class="flex items-center gap-3 mb-3">
						<div class="shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
							<svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
							</svg>
						</div>
						<h3 class="font-semibold text-mg-charcoal text-base">Sign Up for CodeRED</h3>
					</div>
					<p class="text-sm text-mg-warmGray mb-3">CodeRED sends alerts about emergency and non-emergency events via telephone, text, and email. Sign up today!</p>
					<a href="https://www.olympia-fields.com" target="_blank" rel="noopener noreferrer" class="btn-primary text-sm">Sign Up →</a>
				</div>

				<!-- Association Covenants & Bylaws -->
				<div class="card-elevated hover-lift">
					<div class="flex items-center gap-3 mb-3">
						<div class="shrink-0 w-10 h-10 rounded-full bg-mg-forest/10 flex items-center justify-center">
							<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
							</svg>
						</div>
						<h3 class="font-semibold text-mg-charcoal text-base">Covenants & Bylaws</h3>
					</div>
					<p class="text-sm text-mg-warmGray mb-3">This document details how our community works, including the makeup of our board and committees.</p>
					<a href="/documents" class="text-sm text-mg-forest font-medium hover:underline">View Documents →</a>
				</div>

				<!-- Village of Olympia Fields -->
				<div class="card-elevated hover-lift">
					<div class="flex items-center gap-3 mb-3">
						<div class="shrink-0 w-10 h-10 rounded-full bg-mg-forest/10 flex items-center justify-center">
							<svg class="w-5 h-5 text-mg-forest" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
								<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
							</svg>
						</div>
						<h3 class="font-semibold text-mg-charcoal text-base">Village of Olympia Fields</h3>
					</div>
					<p class="text-sm text-mg-warmGray mb-3">Access village services, public meeting schedules, and municipal resources.</p>
					<a href="https://www.olympia-fields.com" target="_blank" rel="noopener noreferrer" class="text-sm text-mg-forest font-medium hover:underline">View Meeting Schedule →</a>
				</div>

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
				<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
					<p class="text-sm text-amber-800">
						<strong>Under Construction</strong> — The online payment portal is currently being set up. We are working to have it up and running soon.
					</p>
				</div>
				<p class="text-sm text-mg-warmGray">In the meantime, please contact the Treasurer for payment instructions.</p>
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
				<a href="https://www.olympia-fields.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 rounded-lg hover:bg-mg-stone/30 transition-colors no-underline group">
					<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
					</svg>
					<span class="text-sm text-mg-charcoal group-hover:text-mg-forest transition-colors">Village Website</span>
				</a>
				<a href="https://www.olympia-fields.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 rounded-lg hover:bg-mg-stone/30 transition-colors no-underline group">
					<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					<span class="text-sm text-mg-charcoal group-hover:text-mg-forest transition-colors">Public Meeting Schedule</span>
				</a>
				<a href="https://ofparks.org" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-3 rounded-lg hover:bg-mg-stone/30 transition-colors no-underline group">
					<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
					<span class="text-sm text-mg-charcoal group-hover:text-mg-forest transition-colors">Olympia Fields Park District</span>
				</a>
				<a href="/documents" class="flex items-center gap-3 p-3 rounded-lg hover:bg-mg-stone/30 transition-colors no-underline group">
					<svg class="w-5 h-5 text-mg-forest shrink-0" fill="none" stroke="currentColor" stroke-width="1.75" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
					</svg>
					<span class="text-sm text-mg-charcoal group-hover:text-mg-forest transition-colors">MPOA Documents & Minutes</span>
				</a>
			</div>
		</section>

		<!-- FAQs -->
		<section class="mb-12">
			<h2 class="font-display text-2xl font-bold text-mg-charcoal mb-2">Frequently Asked Questions</h2>
			<p class="text-sm text-mg-warmGray mb-6">Common questions from Maynegaite homeowners.</p>
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
								<p class="pt-3">{faq.a}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</section>

		<!-- Community Reminders -->
		<section class="card-subtle">
			<h2 class="font-display text-xl font-bold text-mg-charcoal mb-4">Community Reminders</h2>
			<ul class="space-y-2 text-sm text-mg-charcoal">
				<li>"For Sale" signs are <strong>not permitted</strong> within the subdivision per MPOA covenants.</li>
				<li>All exterior modifications require Architectural Committee approval before work begins.</li>
				<li>The Village offers a <strong>$2,000 annual grant</strong> to active HOAs for community beautification.</li>
				<li>Keep your property maintained — the MPOA enforces aesthetic standards for all lots.</li>
			</ul>
		</section>
	</div>
</div>
