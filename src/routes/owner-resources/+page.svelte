<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
</script>

<SEO title="Owner Resources" description="Essential resources and links for Maynegaite homeowners." />

<div class="py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mb-4">Owner Resources</h1>
		<p class="text-lg text-mg-warmGray mb-12">Essential tools and information for Maynegaite homeowners.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- Emergency Notifications -->
			<div class="card-premium">
				<h3 class="font-semibold text-mg-charcoal text-lg mb-2">Emergency Notifications</h3>
				<p class="text-sm text-mg-warmGray mb-3">
					Sign up for CodeRED to receive emergency and non-emergency notifications via text, email, and phone.
				</p>
				<a href="https://www.olympia-fields.com" target="_blank" rel="noopener noreferrer" class="btn-primary text-sm">
					Village Website
				</a>
			</div>

			<!-- Village of Olympia Fields -->
			<div class="card-premium">
				<h3 class="font-semibold text-mg-charcoal text-lg mb-2">Village of Olympia Fields</h3>
				<p class="text-sm text-mg-warmGray mb-3">
					Access village services, meeting agendas, and municipal resources.
				</p>
				<a href="https://www.olympia-fields.com" target="_blank" rel="noopener noreferrer" class="btn-secondary text-sm">
					Visit Website
				</a>
			</div>

			<!-- Park District -->
			<div class="card-premium">
				<h3 class="font-semibold text-mg-charcoal text-lg mb-2">Olympia Fields Park District</h3>
				<p class="text-sm text-mg-warmGray mb-3">
					Programs, parks, and recreation facilities including Maynegaite Park, Sgt. Means Park, and more.
				</p>
				<a href="https://ofparks.org" target="_blank" rel="noopener noreferrer" class="btn-secondary text-sm">
					Visit Website
				</a>
			</div>

			<!-- Architectural Guidelines -->
			<div class="card-premium">
				<h3 class="font-semibold text-mg-charcoal text-lg mb-2">Architectural Guidelines</h3>
				<p class="text-sm text-mg-warmGray mb-3">
					All exterior modifications require approval from the Architectural Committee. Review the guidelines before submitting a request.
				</p>
				<a href="/documents" class="btn-secondary text-sm">View Documents</a>
			</div>

			<!-- Branch Pickup Schedule -->
			<div class="card-elevated">
				<h3 class="font-semibold text-mg-charcoal text-lg mb-2">Branch Pickup</h3>
				<p class="text-sm text-mg-warmGray">
					Maynegaite (East side) receives municipal branch pickup on the <strong>1st and 3rd Tuesday</strong> of every month, weather permitting.
				</p>
			</div>

			<!-- HOA Assessments -->
			<div class="card-elevated">
				<h3 class="font-semibold text-mg-charcoal text-lg mb-2">HOA Assessments</h3>
				<p class="text-sm text-mg-warmGray mb-3">
					Keep your assessment current. Contact the Treasurer for questions about your account.
				</p>
				<a href="/contact" class="text-sm text-mg-forest hover:underline">Contact the Board</a>
			</div>
		</div>

		<!-- Reminders -->
		<section class="mt-12 card-subtle">
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
