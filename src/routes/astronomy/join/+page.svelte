<script lang="ts">
	import GlassPanel from '$lib/components/astronomy/GlassPanel.svelte';
</script>

<svelte:head>
	<title>Join | UIC Astronomy Club</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="mb-16 text-center">
			<p class="font-mono text-xs tracking-[0.3em] text-astro-indigo/80 mb-4">BECOME A MEMBER</p>
			<h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-astro-cream chromatic-text">
				JOIN THE OBSERVATORY
			</h1>
			<div class="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-astro-indigo to-transparent"></div>
		</div>

		<!-- Benefits -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
			<GlassPanel class="p-6">
				<div class="flex items-start gap-4">
					<span class="text-astro-cyan text-xl flex-shrink-0">&#9734;</span>
					<div>
						<h3 class="font-display text-lg font-bold text-astro-cream mb-2">Observing Sessions</h3>
						<p class="font-body text-sm text-astro-cream/60">
							Access to telescope equipment and guided observing nights on campus and at dark sky sites.
						</p>
					</div>
				</div>
			</GlassPanel>

			<GlassPanel class="p-6">
				<div class="flex items-start gap-4">
					<span class="text-astro-cyan text-xl flex-shrink-0">&#9734;</span>
					<div>
						<h3 class="font-display text-lg font-bold text-astro-cream mb-2">Guest Lectures</h3>
						<p class="font-body text-sm text-astro-cream/60">
							Hear from professional astronomers, astrophysicists, and researchers at the forefront of discovery.
						</p>
					</div>
				</div>
			</GlassPanel>

			<GlassPanel class="p-6">
				<div class="flex items-start gap-4">
					<span class="text-astro-cyan text-xl flex-shrink-0">&#9734;</span>
					<div>
						<h3 class="font-display text-lg font-bold text-astro-cream mb-2">Workshops</h3>
						<p class="font-body text-sm text-astro-cream/60">
							Learn astrophotography, telescope operation, celestial navigation, and more through hands-on workshops.
						</p>
					</div>
				</div>
			</GlassPanel>

			<GlassPanel class="p-6">
				<div class="flex items-start gap-4">
					<span class="text-astro-cyan text-xl flex-shrink-0">&#9734;</span>
					<div>
						<h3 class="font-display text-lg font-bold text-astro-cream mb-2">Community</h3>
						<p class="font-body text-sm text-astro-cream/60">
							Connect with fellow space enthusiasts, build lasting friendships, and be part of a passionate community.
						</p>
					</div>
				</div>
			</GlassPanel>
		</div>

		<!-- CTA -->
		<GlassPanel glow class="p-8 sm:p-12 text-center">
			<h2 class="font-display text-2xl font-bold text-astro-cream mb-4">Ready to explore the cosmos?</h2>
			<p class="font-body text-base text-astro-cream/60 mb-8 max-w-lg mx-auto">
				No experience necessary. All UIC students are welcome to join, regardless of major or year.
				Come to a meeting and see what we are all about.
			</p>
			<div class="flex flex-col sm:flex-row gap-4 justify-center">
				<a href="/astronomy/events" class="pill-btn no-underline">
					VIEW UPCOMING EVENTS
				</a>
				<a href="/astronomy/contact" class="pill-btn no-underline">
					GET IN TOUCH
				</a>
			</div>
		</GlassPanel>
	</div>
</section>
