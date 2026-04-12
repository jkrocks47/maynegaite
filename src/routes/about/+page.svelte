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
						197 residential lots within Maynegaite — with its established single-family estates,
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
				Maynegaite
			</h2>
			<p class="text-mg-warmGray mt-3 mb-10 max-w-2xl mx-auto text-center">
				A distinguished neighborhood of spacious single-family estates with room for generations.
			</p>
			<div class="max-w-lg mx-auto">
				<div class="card-premium hover-lift">
					<span class="badge badge-gold mb-3">Single-Family Estates</span>
					<h3 class="font-display text-xl font-bold text-mg-charcoal mb-3">Maynegaite</h3>
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
		<div class="max-w-5xl mx-auto">
			<p class="text-mg-gold text-xs uppercase tracking-[0.2em] font-medium text-center">Raise Your Family Right</p>
			<h2 class="font-display text-3xl font-bold text-mg-charcoal text-center mt-2">
				A Commitment to Education
			</h2>
			<p class="text-mg-warmGray text-center max-w-2xl mx-auto mt-4 mb-10">
				Maynegaite families enjoy access to an exceptional range of public, private, and higher education institutions — from National Blue Ribbon elementary schools to world-class universities just minutes away.
			</p>

			<!-- Southland Feature Card -->
			<div class="card-premium mb-12 max-w-2xl mx-auto">
				<h4 class="font-semibold text-mg-forest mb-3">Southland College Prep Highlights</h4>
				<ul class="text-sm text-mg-charcoal space-y-2">
					<li><strong class="text-mg-forest">100%</strong> college acceptance rate</li>
					<li><strong class="text-mg-forest">95%</strong> graduation rate (vs. 87.7% state average)</li>
					<li>#3 Best Charter High School in Illinois</li>
					<li>Led by CEO Dr. Blondean Y. Davis, Illinois Black Hall of Fame inductee</li>
				</ul>
			</div>

			<!-- School Lists -->
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

				<!-- Elementary & Middle -->
				<div>
					<h3 class="font-display text-base font-bold text-mg-forest mb-4 pb-2 border-b border-mg-gold/40 uppercase tracking-wider">
						Elementary &amp; Middle
					</h3>
					<ul class="space-y-3">
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Arcadia Elementary</p>
							<p class="text-xs text-mg-warmGray">Grades K–3 · National Blue Ribbon School</p>
							<a href="https://www.greatschools.org/illinois/olympia-fields/2818-Arcadia-Elementary-School/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">GreatSchools</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Illinois School</p>
							<p class="text-xs text-mg-warmGray">K–8 · ISBE Exemplary School</p>
							<a href="https://www.greatschools.org/illinois/olympia-fields/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">GreatSchools</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Western Avenue School</p>
							<p class="text-xs text-mg-warmGray">Grades K–5 · B+ Niche Rating</p>
							<a href="https://www.usnews.com/education/k12/illinois/western-avenue-elementary-school-225424/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">U.S. News</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Parker Junior High School</p>
							<p class="text-xs text-mg-warmGray">Grades 6–8</p>
							<a href="https://www.niche.com/k12/parker-junior-high-school-flossmoor-il/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">Niche</a>
						</li>
					</ul>
				</div>

				<!-- High Schools -->
				<div>
					<h3 class="font-display text-base font-bold text-mg-forest mb-4 pb-2 border-b border-mg-gold/40 uppercase tracking-wider">
						High Schools
					</h3>
					<ul class="space-y-3">
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Homewood-Flossmoor High School</p>
							<p class="text-xs text-mg-warmGray">97% graduation rate · #110 Best Public High Schools in IL</p>
							<a href="https://www.usnews.com/education/best-high-schools/illinois/districts/homewood-flossmoor-community-high-school-district-233/homewood-flossmoor-high-school-6783" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">U.S. News</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Southland College Preparatory Charter School</p>
							<p class="text-xs text-mg-warmGray">A– Niche · 100% college acceptance rate</p>
							<a href="https://www.usnews.com/education/best-high-schools/illinois/districts/southland-college-prep-chtr-high-school/southland-college-prep-142287" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">U.S. News</a>
						</li>
					</ul>
				</div>

				<!-- Private Schools -->
				<div>
					<h3 class="font-display text-base font-bold text-mg-forest mb-4 pb-2 border-b border-mg-gold/40 uppercase tracking-wider">
						Private Schools
					</h3>
					<ul class="space-y-3">
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Infant Jesus of Prague School</p>
							<p class="text-xs text-mg-warmGray">PK–8 · A– Niche · 2× Blue Ribbon School</p>
							<a href="https://www.niche.com/k12/infant-jesus-of-prague-school-flossmoor-il/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">Niche</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Marian Catholic High School</p>
							<p class="text-xs text-mg-warmGray">A Niche · #23 Catholic High School in Illinois</p>
							<a href="https://www.niche.com/k12/marian-catholic-high-school-chicago-heights-il/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">Niche</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Deer Creek Christian School</p>
							<p class="text-xs text-mg-warmGray">PK–8 · 4.8/5 GreatSchools · 8:1 student-teacher ratio</p>
							<a href="https://www.greatschools.org/illinois/university-park/5387-Deer-Creek-Christian-School/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">GreatSchools</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Flossmoor Montessori School</p>
							<p class="text-xs text-mg-warmGray">PK–4 · AMI Accredited</p>
							<a href="https://www.greatschools.org/illinois/flossmoor/5255-Flossmoor-Montessori-School/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">GreatSchools</a>
						</li>
					</ul>
				</div>

				<!-- Higher Education -->
				<div>
					<h3 class="font-display text-base font-bold text-mg-forest mb-4 pb-2 border-b border-mg-gold/40 uppercase tracking-wider">
						Higher Education
					</h3>
					<ul class="space-y-3">
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Lewis University</p>
							<p class="text-xs text-mg-warmGray">#29 Regional Universities Midwest · U.S. News</p>
							<a href="https://www.usnews.com/best-colleges/lewis-university-1707" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">U.S. News</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Governors State University</p>
							<p class="text-xs text-mg-warmGray">#21 Best Value Colleges in Illinois</p>
							<a href="https://www.niche.com/colleges/governors-state-university/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">Niche</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Joliet Junior College</p>
							<p class="text-xs text-mg-warmGray">Top 20% of Illinois community colleges</p>
							<a href="https://www.collegefactual.com/colleges/joliet-junior-college/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">College Factual</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">South Suburban College</p>
							<p class="text-xs text-mg-warmGray">#27 in Illinois · 12:1 student-faculty ratio</p>
							<a href="https://www.collegefactual.com/colleges/south-suburban-college/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">College Factual</a>
						</li>
						<li>
							<p class="font-semibold text-mg-charcoal text-sm">Prairie State College</p>
							<p class="text-xs text-mg-warmGray">Top 20% of Illinois community colleges</p>
							<a href="https://www.collegefactual.com/colleges/prairie-state-college/" target="_blank" rel="noopener noreferrer" class="text-xs text-mg-gold hover:underline">College Factual</a>
						</li>
					</ul>
					<p class="text-xs text-mg-warmGray mt-5 italic">Downtown Chicago is a 45-minute Metra ride away — via two stations in Olympia Fields.</p>
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
