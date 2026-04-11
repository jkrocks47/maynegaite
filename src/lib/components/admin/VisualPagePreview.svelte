<script lang="ts">
	import type { ContentEntry } from '$lib/utils/content-registry';

	interface Props {
		page: string;
		content: Record<string, string>;
		entries: ContentEntry[];
		activeSection: string | null;
		onSelectSection: (sectionKey: string) => void;
	}

	let { page, content, entries, activeSection, onSelectSection }: Props = $props();

	/** Get current content value for a section */
	function val(section: string): string {
		const entry = entries.find((e) => e.section === section);
		if (!entry) return '';
		return content[`${entry.slug}|${entry.section}`] ?? entry.defaultBody ?? '';
	}

	/** Get the qualified section key (slug|section) */
	function key(section: string): string {
		const entry = entries.find((e) => e.section === section);
		return entry ? `${entry.slug}|${entry.section}` : '';
	}

	/** Check if a section is currently active */
	function isActive(section: string): boolean {
		return key(section) === activeSection;
	}

	/** Handle section click */
	function select(section: string) {
		const k = key(section);
		if (k) onSelectSection(k);
	}

	/** Get the human label for a section */
	function tip(section: string): string {
		return entries.find((e) => e.section === section)?.label ?? section;
	}
</script>

<div class="preview">
	{#if page === 'Homepage'}
		<!-- Hero -->
		<div class="band dark">
			<div class="band-inner pad-lg">
				<span class="accent-label">Olympia Fields, Illinois</span>
				<div class="accent-line"></div>
				<button class="region" class:region-on={isActive('hero-title')} onclick={() => select('hero-title')} title={tip('hero-title')}>
					<span class="txt-hero">{val('hero-title')}</span>
				</button>
				<button class="region" class:region-on={isActive('hero-subtitle')} onclick={() => select('hero-subtitle')} title={tip('hero-subtitle')}>
					<span class="txt-sub">{val('hero-subtitle')}</span>
				</button>
				<button class="region region-inline" class:region-on={isActive('hero-cta')} onclick={() => select('hero-cta')} title={tip('hero-cta')}>
					<span class="mini-btn">{val('hero-cta')}</span>
				</button>
			</div>
		</div>

		<!-- Portal / Quick Links -->
		<div class="band light">
			<div class="band-inner pad-md">
				<span class="accent-label center">Resident Portal</span>
				<button class="region region-center" class:region-on={isActive('quick-links-title')} onclick={() => select('quick-links-title')} title={tip('quick-links-title')}>
					<span class="txt-heading-dark center">{val('quick-links-title')}</span>
				</button>
				<div class="grid-3">
					{#each Array(6) as _}
						<div class="skel-card"></div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Events -->
		<div class="band light-alt">
			<div class="band-inner pad-sm">
				<span class="accent-label center">Mark Your Calendar</span>
				<button class="region region-center" class:region-on={isActive('events-title')} onclick={() => select('events-title')} title={tip('events-title')}>
					<span class="txt-heading-dark center">{val('events-title')}</span>
				</button>
				<div class="grid-2">
					<div class="skel-event"></div>
					<div class="skel-event"></div>
				</div>
			</div>
		</div>

		<!-- About CTA -->
		<div class="band dark">
			<div class="band-inner pad-md split-2">
				<div>
					<span class="accent-label">About Our Community</span>
					<button class="region" class:region-on={isActive('about-title')} onclick={() => select('about-title')} title={tip('about-title')}>
						<span class="txt-heading-light">{val('about-title')}</span>
					</button>
					<button class="region" class:region-on={isActive('about-body')} onclick={() => select('about-body')} title={tip('about-body')}>
						<span class="txt-body-light clamp-3">{val('about-body')}</span>
					</button>
				</div>
				<div class="stat-stack">
					<div class="stat-card">
						<span class="stat-val">78%</span>
						<span class="stat-label">Homeownership</span>
					</div>
					<div class="stat-card">
						<span class="stat-val">Top 5%</span>
						<span class="stat-label">U.S. Income</span>
					</div>
				</div>
			</div>
		</div>

	{:else if page === 'About Page'}
		<!-- Hero -->
		<div class="band dark">
			<div class="band-inner pad-lg center-text">
				<span class="accent-label center">Olympia Fields, Illinois</span>
				<div class="accent-line center-line"></div>
				<button class="region region-center" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-hero center">{val('page-title')}</span>
				</button>
				<button class="region region-center" class:region-on={isActive('page-description')} onclick={() => select('page-description')} title={tip('page-description')}>
					<span class="txt-sub center">{val('page-description')}</span>
				</button>
			</div>
		</div>

		<!-- Stats -->
		<div class="band warm">
			<div class="band-inner pad-sm">
				<div class="stat-row">
					<div><span class="stat-val-dark">197</span><span class="stat-label-dark">Lots</span></div>
					<div><span class="stat-val-dark">~$124K</span><span class="stat-label-dark">Income</span></div>
					<div><span class="stat-val-dark">38 ac</span><span class="stat-label-dark">Nature</span></div>
					<div><span class="stat-val-dark">1970s</span><span class="stat-label-dark">Founded</span></div>
				</div>
			</div>
		</div>

		<!-- Story / History -->
		<div class="band light">
			<div class="band-inner pad-md">
				<span class="accent-label center">Our Story</span>
				<button class="region" class:region-on={isActive('history-body')} onclick={() => select('history-body')} title={tip('history-body')}>
					<span class="txt-body-dark clamp-4">{val('history-body')}</span>
				</button>
			</div>
		</div>

		<!-- Amenities -->
		<div class="band dark">
			<div class="band-inner pad-md">
				<button class="region" class:region-on={isActive('amenities-title')} onclick={() => select('amenities-title')} title={tip('amenities-title')}>
					<span class="txt-heading-light">{val('amenities-title')}</span>
				</button>
				<button class="region" class:region-on={isActive('amenities-body')} onclick={() => select('amenities-body')} title={tip('amenities-body')}>
					<span class="txt-body-light clamp-3">{val('amenities-body')}</span>
				</button>
			</div>
		</div>

	{:else if page === 'Board Page'}
		<div class="band light">
			<div class="band-inner pad-lg">
				<button class="region" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-page-title">{val('page-title')}</span>
				</button>
				<button class="region" class:region-on={isActive('page-description')} onclick={() => select('page-description')} title={tip('page-description')}>
					<span class="txt-body-dark">{val('page-description')}</span>
				</button>
				<div class="grid-2 gap-md">
					<div class="skel-officer">
						<div class="skel-avatar"></div>
						<div class="skel-lines">
							<div class="skel-line w60"></div>
							<div class="skel-line w40 gold"></div>
						</div>
					</div>
					<div class="skel-officer">
						<div class="skel-avatar"></div>
						<div class="skel-lines">
							<div class="skel-line w60"></div>
							<div class="skel-line w40 gold"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

	{:else if page === 'Events Page'}
		<div class="band light">
			<div class="band-inner pad-lg">
				<button class="region" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-page-title">{val('page-title')}</span>
				</button>
				<div class="skel-list">
					<div class="skel-event-row">
						<div class="skel-dot"></div>
						<div class="skel-lines">
							<div class="skel-line w70"></div>
							<div class="skel-line w40"></div>
						</div>
						<div class="skel-badge"></div>
					</div>
					<div class="skel-event-row">
						<div class="skel-dot"></div>
						<div class="skel-lines">
							<div class="skel-line w50"></div>
							<div class="skel-line w30"></div>
						</div>
						<div class="skel-badge"></div>
					</div>
					<div class="skel-event-row">
						<div class="skel-dot"></div>
						<div class="skel-lines">
							<div class="skel-line w60"></div>
							<div class="skel-line w35"></div>
						</div>
						<div class="skel-badge"></div>
					</div>
				</div>
			</div>
		</div>

	{:else if page === 'Gallery Page'}
		<div class="band light">
			<div class="band-inner pad-lg">
				<button class="region" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-page-title">{val('page-title')}</span>
				</button>
				<div class="skel-photo-grid">
					{#each Array(6) as _}
						<div class="skel-photo"></div>
					{/each}
				</div>
			</div>
		</div>

	{:else if page === 'Documents Page'}
		<div class="band light">
			<div class="band-inner pad-lg">
				<button class="region" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-page-title">{val('page-title')}</span>
				</button>
				<button class="region" class:region-on={isActive('page-description')} onclick={() => select('page-description')} title={tip('page-description')}>
					<span class="txt-body-dark">{val('page-description')}</span>
				</button>
				<div class="skel-list">
					<div class="skel-doc-row">
						<div class="skel-file-icon red"></div>
						<div class="skel-lines"><div class="skel-line w60"></div></div>
					</div>
					<div class="skel-doc-row">
						<div class="skel-file-icon blue"></div>
						<div class="skel-lines"><div class="skel-line w50"></div></div>
					</div>
					<div class="skel-doc-row">
						<div class="skel-file-icon red"></div>
						<div class="skel-lines"><div class="skel-line w70"></div></div>
					</div>
				</div>
			</div>
		</div>

	{:else if page === 'Contact Page'}
		<div class="band light">
			<div class="band-inner pad-lg">
				<button class="region" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-page-title">{val('page-title')}</span>
				</button>
				<div class="contact-layout">
					<div class="contact-form-box">
						<button class="region" class:region-on={isActive('form-heading')} onclick={() => select('form-heading')} title={tip('form-heading')}>
							<span class="txt-section-heading">{val('form-heading')}</span>
						</button>
						<div class="skel-form-fields">
							<div class="skel-field"></div>
							<div class="skel-field"></div>
							<div class="skel-field tall"></div>
							<div class="skel-submit"></div>
						</div>
					</div>
					<div class="contact-sidebar-box">
						<button class="region" class:region-on={isActive('contact-heading')} onclick={() => select('contact-heading')} title={tip('contact-heading')}>
							<span class="txt-section-heading">{val('contact-heading')}</span>
						</button>
						<div class="skel-info-card"></div>
						<div class="skel-info-card"></div>
					</div>
				</div>
			</div>
		</div>

	{:else if page === 'Owner Resources Page'}
		<div class="band light">
			<div class="band-inner pad-lg">
				<button class="region" class:region-on={isActive('page-title')} onclick={() => select('page-title')} title={tip('page-title')}>
					<span class="txt-page-title">{val('page-title')}</span>
				</button>
				<button class="region" class:region-on={isActive('page-description')} onclick={() => select('page-description')} title={tip('page-description')}>
					<span class="txt-body-dark">{val('page-description')}</span>
				</button>
				
				<div style="margin-top: 1rem;">
					<button class="region" class:region-on={isActive('board-title')} onclick={() => select('board-title')} title={tip('board-title')}>
						<span class="txt-section-heading">{val('board-title')}</span>
					</button>
					<button class="region" class:region-on={isActive('board-description')} onclick={() => select('board-description')} title={tip('board-description')}>
						<span class="txt-body-dark">{val('board-description')}</span>
					</button>
					<div class="grid-2 gap-md" style="margin-top: 0.5rem;">
						<div class="skel-officer">
							<div class="skel-avatar"></div>
							<div class="skel-lines">
								<div class="skel-line w60"></div>
								<div class="skel-line w40 gold"></div>
							</div>
						</div>
						<div class="skel-officer">
							<div class="skel-avatar"></div>
							<div class="skel-lines">
								<div class="skel-line w60"></div>
								<div class="skel-line w40 gold"></div>
							</div>
						</div>
					</div>
				</div>

				<div style="margin-top: 1rem;">
					<button class="region" class:region-on={isActive('resource-grid')} onclick={() => select('resource-grid')} title={tip('resource-grid')}>
						<span class="txt-section-heading">Main Resource Grid</span>
						<div class="grid-3">
							{#each Array(3) as _}
								<div class="skel-card"></div>
							{/each}
						</div>
					</button>
				</div>

				<div style="margin-top: 1rem;">
					<button class="region" class:region-on={isActive('village-resources')} onclick={() => select('village-resources')} title={tip('village-resources')}>
						<span class="txt-section-heading">Village Resources</span>
						<div class="grid-2">
							<div class="skel-line w70"></div>
							<div class="skel-line w50"></div>
						</div>
					</button>
				</div>

				<div style="margin-top: 1rem;">
					<button class="region" class:region-on={isActive('faq-title')} onclick={() => select('faq-title')} title={tip('faq-title')}>
						<span class="txt-section-heading">{val('faq-title')}</span>
					</button>
					<button class="region" class:region-on={isActive('faq-description')} onclick={() => select('faq-description')} title={tip('faq-description')}>
						<span class="txt-body-dark">{val('faq-description')}</span>
					</button>
					<button class="region" class:region-on={isActive('faq-list')} onclick={() => select('faq-list')} title={tip('faq-list')}>
						<div class="skel-list">
							<div class="skel-event-row"><div class="skel-line w70"></div></div>
							<div class="skel-event-row"><div class="skel-line w50"></div></div>
						</div>
					</button>
				</div>

				<div style="margin-top: 1rem;">
					<button class="region" class:region-on={isActive('reminders')} onclick={() => select('reminders')} title={tip('reminders')}>
						<span class="txt-section-heading">Community Reminders</span>
						<div class="txt-body-dark clamp-3" style="margin-top: 0.25rem;">
							{val('reminders')}
						</div>
					</button>
				</div>

				<div style="margin-top: 1rem;">
					<button class="region" class:region-on={isActive('additional-content')} onclick={() => select('additional-content')} title={tip('additional-content')}>
						<span class="txt-section-heading">Additional Content</span>
						<div class="skel-line w100" style="margin-top: 0.25rem;"></div>
						<div class="skel-line w70" style="margin-top: 0.25rem;"></div>
					</button>
				</div>
			</div>
		</div>

	{:else if page === 'Footer'}
		<div class="band dark">
			<div class="band-inner pad-md footer-grid">
				<div>
					<div class="footer-logo-skel"></div>
					<button class="region" class:region-on={isActive('org-name')} onclick={() => select('org-name')} title={tip('org-name')}>
						<span class="txt-footer-name">{val('org-name')}</span>
					</button>
					<button class="region" class:region-on={isActive('tagline')} onclick={() => select('tagline')} title={tip('tagline')}>
						<span class="txt-footer-tagline">{val('tagline')}</span>
					</button>
					<button class="region" class:region-on={isActive('address')} onclick={() => select('address')} title={tip('address')}>
						<span class="txt-footer-address">{val('address')}</span>
					</button>
				</div>
				<div>
					<span class="footer-col-heading">Quick Links</span>
					<div class="footer-skel-links">
						<div class="skel-link"></div>
						<div class="skel-link w70"></div>
						<div class="skel-link"></div>
						<div class="skel-link w70"></div>
					</div>
				</div>
				<div>
					<span class="footer-col-heading">Contact</span>
					<div class="footer-skel-links">
						<div class="skel-link w80"></div>
						<div class="skel-link w60"></div>
					</div>
				</div>
			</div>
		</div>
		<div class="footer-bottom-bar">
			<div class="skel-line w50 center-skel"></div>
		</div>
	{/if}
</div>

<style>
	/* === Container === */
	.preview {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		overflow: hidden;
		border-radius: 0 0 0.5rem 0.5rem;
	}

	/* === Band Sections === */
	.band {}
	.dark { background: #1B4332; }
	.light { background: #FAF8F0; }
	.light-alt { background: #f5f3ec; }
	.warm { background: #F5F0E8; }

	.band-inner { max-width: 100%; }
	.pad-lg { padding: 1.5rem 1.25rem; }
	.pad-md { padding: 1rem 1.25rem; }
	.pad-sm { padding: 0.75rem 1.25rem; }

	/* === Accent / Label === */
	.accent-label {
		display: block;
		font-size: 7.5px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: #C9A84C;
		opacity: 0.7;
		margin-bottom: 0.25rem;
	}
	.accent-label.center { text-align: center; }

	.accent-line {
		width: 2rem;
		height: 1px;
		background: rgba(201, 168, 76, 0.4);
		margin: 0.375rem 0;
	}
	.accent-line.center-line { margin: 0.375rem auto; }

	.center-text { text-align: center; }

	/* === Typography === */
	.txt-hero {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700;
		font-size: 15px;
		line-height: 1.2;
		color: white;
	}
	.txt-hero.center { text-align: center; }

	.txt-sub {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-style: italic;
		font-size: 9.5px;
		line-height: 1.45;
		color: rgba(255, 255, 255, 0.6);
		margin-top: 0.25rem;
	}
	.txt-sub.center { text-align: center; }

	.txt-heading-dark {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700;
		font-size: 13px;
		color: #333;
	}
	.txt-heading-dark.center { text-align: center; }

	.txt-heading-light {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700;
		font-size: 13px;
		color: white;
	}

	.txt-page-title {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700;
		font-size: 17px;
		color: #333;
		margin-bottom: 0.25rem;
	}

	.txt-section-heading {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700;
		font-size: 11px;
		color: #333;
	}

	.txt-body-dark {
		display: block;
		font-size: 9px;
		line-height: 1.55;
		color: #8B8B8B;
	}

	.txt-body-light {
		display: block;
		font-size: 9px;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.5);
		margin-top: 0.125rem;
	}

	.txt-footer-name {
		display: block;
		font-size: 10px;
		font-weight: 600;
		color: white;
	}

	.txt-footer-tagline {
		display: block;
		font-size: 8.5px;
		color: rgba(255, 255, 255, 0.5);
		font-style: italic;
		margin-top: 0.125rem;
	}

	.txt-footer-address {
		display: block;
		font-size: 8px;
		color: rgba(255, 255, 255, 0.35);
		margin-top: 0.25rem;
	}

	.clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }

	.mini-btn {
		display: inline-block;
		padding: 3px 10px;
		background: #C9A84C;
		color: #1B4332;
		border-radius: 3px;
		font-size: 8.5px;
		font-weight: 600;
		margin-top: 0.5rem;
	}

	/* === Editable Regions === */
	.region {
		all: unset;
		cursor: pointer;
		display: block;
		position: relative;
		border-radius: 3px;
		outline: 2px dashed transparent;
		outline-offset: 3px;
		padding: 2px 5px;
		margin: -2px -5px;
		text-align: left;
		width: calc(100% + 10px);
		transition: outline-color 0.15s ease, background-color 0.15s ease;
	}

	.region-inline {
		display: inline-block;
		width: auto;
	}

	.region-center { text-align: center; }

	/* Light bg: green hover */
	.light .region:hover,
	.light-alt .region:hover,
	.warm .region:hover {
		outline-color: rgba(27, 67, 50, 0.4);
		background: rgba(27, 67, 50, 0.05);
	}
	.light .region-on,
	.light-alt .region-on,
	.warm .region-on {
		outline: 2px solid rgba(27, 67, 50, 0.65);
		background: rgba(27, 67, 50, 0.07);
	}

	/* Dark bg: gold hover */
	.dark .region:hover {
		outline-color: rgba(201, 168, 76, 0.45);
		background: rgba(201, 168, 76, 0.08);
	}
	.dark .region-on {
		outline: 2px solid rgba(201, 168, 76, 0.65);
		background: rgba(201, 168, 76, 0.1);
	}

	/* === Layouts === */
	.split-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
	.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.375rem; margin-top: 0.5rem; }
	.grid-2.gap-md { gap: 0.5rem; }
	.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.25rem; margin-top: 0.5rem; }

	.contact-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 0.5rem; margin-top: 0.5rem; }
	.footer-grid { display: grid; grid-template-columns: 1.3fr 1fr 1fr; gap: 0.75rem; }
	.stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; text-align: center; }

	/* === Stats === */
	.stat-stack { display: flex; flex-direction: column; gap: 0.375rem; }
	.stat-card {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.375rem;
		padding: 0.5rem 0.625rem;
	}
	.stat-val {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700; font-size: 14px; color: #C9A84C;
	}
	.stat-label { display: block; font-size: 7px; color: rgba(255, 255, 255, 0.35); margin-top: 0.125rem; }
	.stat-val-dark {
		display: block;
		font-family: 'Playfair Display', Georgia, serif;
		font-weight: 700; font-size: 13px; color: #1B4332;
	}
	.stat-label-dark {
		display: block; font-size: 7px; color: #8B8B8B;
		text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.125rem;
	}

	/* === Skeleton Placeholders === */
	.skel-card {
		height: 1.625rem; background: white;
		border-radius: 0.375rem; border: 1px solid #e5e7eb;
		box-shadow: 0 1px 2px rgba(0,0,0,0.03);
	}
	.skel-event {
		height: 2.25rem; background: white;
		border-radius: 0.375rem; border: 1px solid #e5e7eb;
	}
	.skel-list { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.5rem; }

	.skel-event-row, .skel-doc-row {
		display: flex; align-items: center; gap: 0.375rem;
		padding: 0.375rem 0.5rem;
		background: white; border: 1px solid #e5e7eb; border-radius: 0.375rem;
	}
	.skel-dot {
		width: 1rem; height: 1rem; border-radius: 0.25rem;
		background: rgba(27, 67, 50, 0.08); flex-shrink: 0;
	}
	.skel-file-icon {
		width: 0.875rem; height: 1.125rem; border-radius: 2px;
		flex-shrink: 0;
	}
	.skel-file-icon.red { background: #fee2e2; }
	.skel-file-icon.blue { background: #dbeafe; }
	.skel-lines { flex: 1; display: flex; flex-direction: column; gap: 0.125rem; }
	.skel-line { height: 4.5px; background: #e5e7eb; border-radius: 2px; }
	.skel-line.w30 { width: 30%; } .skel-line.w35 { width: 35%; }
	.skel-line.w40 { width: 40%; } .skel-line.w50 { width: 50%; }
	.skel-line.w60 { width: 60%; } .skel-line.w70 { width: 70%; }
	.skel-line.gold { background: rgba(201, 168, 76, 0.25); }
	.skel-line.center-skel { margin: 0 auto; }
	.skel-badge { width: 1.25rem; height: 0.5rem; background: #e5e7eb; border-radius: 2px; flex-shrink: 0; }

	.skel-officer {
		display: flex; align-items: center; gap: 0.375rem;
		padding: 0.5rem; background: white;
		border: 1px solid #e5e7eb; border-radius: 0.5rem;
	}
	.skel-avatar {
		width: 1.375rem; height: 1.375rem; border-radius: 50%;
		background: rgba(27, 67, 50, 0.08); flex-shrink: 0;
	}
	.skel-photo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.25rem; margin-top: 0.5rem; }
	.skel-photo { aspect-ratio: 1; background: #e8e5de; border-radius: 0.25rem; }

	.skel-form-fields { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 0.375rem; }
	.skel-field { height: 0.875rem; background: #f3f4f6; border-radius: 0.25rem; }
	.skel-field.tall { height: 1.5rem; }
	.skel-submit { width: 3rem; height: 0.75rem; background: #1B4332; border-radius: 0.25rem; margin-top: 0.125rem; }

	.contact-form-box, .contact-sidebar-box {
		background: white; border: 1px solid #e5e7eb;
		border-radius: 0.375rem; padding: 0.5rem;
	}
	.skel-info-card {
		height: 1.25rem; background: #f9fafb;
		border: 1px solid #e5e7eb; border-radius: 0.25rem; margin-top: 0.25rem;
	}

	/* Footer */
	.footer-logo-skel {
		width: 2rem; height: 1.25rem;
		background: rgba(255, 255, 255, 0.12);
		border-radius: 0.25rem; margin-bottom: 0.375rem;
	}
	.footer-col-heading {
		display: block; font-size: 7px; font-weight: 600;
		text-transform: uppercase; letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.45); margin-bottom: 0.375rem;
	}
	.footer-skel-links { display: flex; flex-direction: column; gap: 0.125rem; }
	.skel-link { height: 3.5px; background: rgba(255, 255, 255, 0.1); border-radius: 2px; width: 55%; }
	.skel-link.w60 { width: 60%; } .skel-link.w70 { width: 70%; } .skel-link.w80 { width: 80%; }

	.footer-bottom-bar {
		background: #1B4332;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		padding: 0.5rem 1.25rem;
	}
</style>
