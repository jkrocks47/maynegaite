<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-mg-forest text-white/90">
	<div class="max-w-6xl mx-auto px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Branding -->
			<div>
				<h3 class="font-display text-xl font-bold text-white mb-2">Maynegaite POA</h3>
				<p class="text-sm text-white/60">Where neighbors become family.</p>
				<p class="text-sm text-white/50 mt-3">P.O. Box 214<br />Olympia Fields, IL 60461</p>
			</div>

			<!-- Quick Links -->
			<div>
				<h4 class="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
				<ul class="space-y-2">
					<li><a href="/about" class="text-sm text-white/70 hover:text-white transition-colors no-underline">About</a></li>
					<li><a href="/events" class="text-sm text-white/70 hover:text-white transition-colors no-underline">Events</a></li>
					<li><a href="/board" class="text-sm text-white/70 hover:text-white transition-colors no-underline">Board of Directors</a></li>
					<li><a href="/documents" class="text-sm text-white/70 hover:text-white transition-colors no-underline">Documents</a></li>
					<li><a href="/owner-resources" class="text-sm text-white/70 hover:text-white transition-colors no-underline">Owner Resources</a></li>
				</ul>
			</div>

			<!-- Contact -->
			<div>
				<h4 class="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Contact</h4>
				<p class="text-sm text-white/70">
					<a href="mailto:info@maynegaite.com" class="text-white/70 hover:text-white transition-colors no-underline">info@maynegaite.com</a>
				</p>
				<p class="text-sm text-white/50 mt-3">
					For emergencies, contact the<br />
					Village of Olympia Fields<br />
					<a href="tel:7085038000" class="text-white/70 hover:text-white no-underline">(708) 503-8000</a>
				</p>
			</div>
		</div>
	</div>

	<!-- Bottom bar -->
	<div class="border-t border-white/10 py-4 px-4">
		<div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
			<span>&copy; {currentYear} Maynegaite Property Owners' Association</span>
			<span>Olympia Fields, IL 60461</span>
		</div>
	</div>
</footer>
