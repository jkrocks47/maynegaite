<script lang="ts">
	import SEO from '$lib/components/shared/SEO.svelte';
	import ScrollReveal from '$lib/components/community/ScrollReveal.svelte';
</script>

<SEO
	title="About Maynegaite"
	description="Maynegaite is a premier residential community in Olympia Fields, Illinois — where African-American excellence, homeownership pride, and elegant living converge."
/>

<!-- Section 1: Hero -->
<section class="bg-mg-forest py-24 px-4 text-center text-white">
	<div class="max-w-3xl mx-auto">
		<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium">Olympia Fields, Illinois</p>
		<hr class="border-t border-mg-gold/40 w-16 mx-auto my-4" />
		<h1 class="font-display text-5xl md:text-6xl font-bold text-white leading-tight">
			Elegant Living.<br />Enduring Legacy.
		</h1>
		<p class="font-display italic text-xl text-white/70 max-w-2xl mx-auto mt-6">
			A premier residential community where African-American excellence, homeownership pride, and
			neighborhood life converge in one of the most distinguished villages in the United States.
		</p>
	</div>
</section>

<!-- Section 2: At-a-Glance Stats -->
<section class="bg-mg-parchment paper-texture py-14 px-4">
	<ScrollReveal>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
			<div>
				<span class="block w-6 h-0.5 bg-mg-gold mx-auto mb-3"></span>
				<p class="font-display text-4xl font-bold text-mg-forest">197</p>
				<p class="text-xs text-mg-warmGray uppercase tracking-wider mt-1">Residential Lots</p>
			</div>
			<div>
				<span class="block w-6 h-0.5 bg-mg-gold mx-auto mb-3"></span>
				<p class="font-display text-4xl font-bold text-mg-forest">~$124K</p>
				<p class="text-xs text-mg-warmGray uppercase tracking-wider mt-1">Median Household Income</p>
			</div>
			<div>
				<span class="block w-6 h-0.5 bg-mg-gold mx-auto mb-3"></span>
				<p class="font-display text-4xl font-bold text-mg-forest">38 ac</p>
				<p class="text-xs text-mg-warmGray uppercase tracking-wider mt-1">Irons Oaks Nature Preserve</p>
			</div>
			<div>
				<span class="block w-6 h-0.5 bg-mg-gold mx-auto mb-3"></span>
				<p class="font-display text-4xl font-bold text-mg-forest">Est. 1970s</p>
				<p class="text-xs text-mg-warmGray uppercase tracking-wider mt-1">Community Founded</p>
			</div>
		</div>
	</ScrollReveal>
</section>

<!-- Section 3: Our Story -->
<section class="bg-mg-ivory py-20 px-4">
	<ScrollReveal>
		<div class="max-w-4xl mx-auto">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Our Story</p>
			<h2 class="font-display text-3xl md:text-4xl font-bold text-mg-charcoal text-center mt-2">
				Roots in Excellence
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
				<div class="space-y-4 text-mg-charcoal leading-relaxed">
					<p>
						Maynegaite was developed in the late 1970s within the Village of Olympia Fields — a
						community that stands among the wealthiest and most highly educated majority
						African-American municipalities in the United States. From its earliest lots, Maynegaite
						attracted families who understood that a home is more than a structure: it is a statement
						of identity, aspiration, and belonging.
					</p>
					<p>
						Over five decades, that founding vision has deepened. The community encompasses
						197 residential lots within Maynegaite Woods — with its established single-family estates,
						while Olympia Fields has continued to rank among the nation's
						top communities for income, education, and quality of life.
					</p>
				</div>
				<div class="card-premium flex items-center">
					<blockquote class="font-display italic text-lg text-mg-charcoal leading-relaxed">
						"Positioned alongside the historic Olympia Fields Country Club — host of the 1927 and
						2003 U.S. Opens — Maynegaite sits at the intersection of Black excellence and American
						legacy."
					</blockquote>
				</div>
			</div>
		</div>
	</ScrollReveal>
</section>

<!-- Section 4: The Neighborhood -->
<section class="bg-mg-parchment py-20 px-4">
	<ScrollReveal>
		<div class="max-w-4xl mx-auto">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Where You'll Live</p>
			<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mt-2">
				Maynegaite Woods
			</h2>
			<p class="text-mg-warmGray mt-3 mb-10 max-w-2xl mx-auto text-center">
				A distinguished neighborhood of spacious single-family estates with room for generations.
			</p>
			<div class="max-w-lg mx-auto">
				<div class="card-premium hover-lift">
					<span class="badge badge-gold mb-3">Single-Family Estates</span>
					<h3 class="font-display text-xl font-bold text-mg-charcoal mb-3">Maynegaite Woods</h3>
					<p class="text-mg-charcoal leading-relaxed mb-2">
						The architectural core of the subdivision, featuring spacious single-family homes built
						from the late 1970s through the early 1990s.
					</p>
					<ul class="text-sm text-mg-warmGray space-y-1 mt-3">
						<li>197 residential lots</li>
						<li>2,500 to 7,200+ square feet</li>
						<li>Generous lots of 0.4 to 0.7+ acres</li>
						<li>Brick construction, traditional styling</li>
					</ul>
				</div>
			</div>
		</div>
	</ScrollReveal>
</section>

<!-- Section 5: Parks, Preserves & Prestige -->
<section class="bg-mg-forest py-20 px-4">
	<ScrollReveal>
		<div class="max-w-5xl mx-auto">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Your Surroundings</p>
			<h2 class="font-display text-3xl font-bold text-white text-center mt-2">
				Parks, Preserves & Prestige
			</h2>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
				<div class="bg-white/10 rounded-xl p-5 border border-white/20">
					<p class="font-display text-2xl font-bold text-mg-gold">4.2 ac</p>
					<p class="font-semibold text-white mt-1">Maynegaite Park</p>
					<p class="text-sm text-white/70 mt-2">Picnic area, soccer field & accessible playground at London Dr & Orchard Dr</p>
				</div>
				<div class="bg-white/10 rounded-xl p-5 border border-white/20">
					<p class="font-display text-2xl font-bold text-mg-gold">20 ac</p>
					<p class="font-semibold text-white mt-1">Sgt. Means Park</p>
					<p class="text-sm text-white/70 mt-2">18-hole disc golf, tennis & soccer — minutes from your front door</p>
				</div>
				<div class="bg-white/10 rounded-xl p-5 border border-white/20">
					<p class="font-display text-2xl font-bold text-mg-gold">38 ac</p>
					<p class="font-semibold text-white mt-1">Irons Oaks</p>
					<p class="text-sm text-white/70 mt-2">Environmental learning center & nature preserve — a living classroom</p>
				</div>
				<div class="bg-white/10 rounded-xl p-5 border border-white/20">
					<p class="font-display text-2xl font-bold text-mg-gold">Est. 1915</p>
					<p class="font-semibold text-white mt-1">Olympia Fields Country Club</p>
					<p class="text-sm text-white/70 mt-2">Host of the 1927 and 2003 U.S. Opens, a neighbor and a landmark</p>
				</div>
			</div>
		</div>
	</ScrollReveal>
</section>

<!-- Section 6: Education -->
<section class="bg-mg-ivory py-20 px-4">
	<ScrollReveal>
		<div class="max-w-4xl mx-auto">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Raise Your Family Right</p>
			<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mt-2">
				A Commitment to Education
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
				<div class="space-y-4 text-mg-charcoal leading-relaxed">
					<p>
						Maynegaite students attend <strong>Arcadia Elementary</strong> (K–3, 14:1 student-teacher
						ratio) before advancing to one of Illinois' most celebrated secondary institutions.
					</p>
					<p>
						Southland College Preparatory Charter High School isn't just a school — it's a statement
						about what this community expects for its children.
					</p>
				</div>
				<div class="card-premium">
					<h4 class="font-semibold text-mg-forest mb-3">Southland College Prep Highlights</h4>
					<ul class="text-sm text-mg-charcoal space-y-2">
						<li><strong class="text-mg-forest">100%</strong> college acceptance rate</li>
						<li><strong class="text-mg-forest">95%</strong> graduation rate (vs. 87.7% state average)</li>
						<li>#3 Best Charter High School in Illinois</li>
						<li>Led by CEO Dr. Blondean Y. Davis, Illinois Black Hall of Fame inductee</li>
					</ul>
				</div>
			</div>
		</div>
	</ScrollReveal>
</section>

<!-- Section 7: Closing CTA -->
<section class="bg-mg-forest py-24 px-4 text-center text-white">
	<div class="max-w-2xl mx-auto">
		<hr class="border-t border-mg-gold/40 w-16 mx-auto mb-8" />
		<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium">Join Us</p>
		<h2 class="font-display text-4xl font-bold text-white mt-3 mb-4">This is Maynegaite.</h2>
		<p class="text-white/70 text-lg mb-8">
			Where brick-and-mortar meets Black excellence. Where your investment is not just in square
			footage, but in a neighborhood that has stood for five decades and intends to stand for fifty
			more.
		</p>
		<div class="flex flex-wrap gap-4 justify-center">
			<a href="/events" class="btn-gold">View Community Events</a>
			<a href="/contact" class="btn-secondary" style="color:white;border-color:rgba(255,255,255,0.5)">
				Contact the Board
			</a>
		</div>
	</div>
</section>
