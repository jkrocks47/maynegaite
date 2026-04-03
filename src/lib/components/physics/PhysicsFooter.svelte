<script lang="ts">
	interface Props {
		clubInfo?: { contactEmail?: string | null; socialLinks?: Record<string, string> | null } | null;
		content?: Record<string, string>;
	}

	let { clubInfo = null, content = {} }: Props = $props();
</script>

<footer class="bg-gray-50 border-t border-gray-200 pt-10 pb-6">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<!-- Main Grid -->
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
			<div>
				<p class="font-body text-sm font-semibold text-physics-dark mb-3">
					{content['org-name'] ?? 'Society of Physics Students at UIC'}
				</p>
				<p class="font-body text-sm text-physics-dark/50">
					{content['tagline'] ?? 'Exploring the fundamental laws of the universe, one experiment at a time.'}
				</p>
			</div>
			<div>
				<p class="font-body text-sm font-semibold text-physics-dark mb-3">Contact</p>
				<p class="font-body text-sm text-physics-dark/50">
					{clubInfo?.contactEmail ?? 'sps@uic.edu'}
				</p>
				<p class="font-body text-sm text-physics-dark/50 mt-1">
					{content['institution'] ?? 'University of Illinois at Chicago'}
				</p>
			</div>
			<div>
				<p class="font-body text-sm font-semibold text-physics-dark mb-3">Follow Us</p>
				<div class="flex gap-4">
					{#if clubInfo?.socialLinks && Object.keys(clubInfo.socialLinks).length > 0}
						{#each Object.entries(clubInfo.socialLinks) as [platform, url]}
							<a
								href={url}
								target="_blank"
								rel="noopener noreferrer"
								class="font-body text-sm text-physics-dark/50 hover:text-physics-blue transition-colors no-underline"
							>
								{platform.charAt(0).toUpperCase() + platform.slice(1)}
							</a>
						{/each}
					{:else}
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							class="font-body text-sm text-physics-dark/50 hover:text-physics-blue transition-colors no-underline"
						>
							Instagram
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noopener noreferrer"
							class="font-body text-sm text-physics-dark/50 hover:text-physics-blue transition-colors no-underline"
						>
							Twitter
						</a>
					{/if}
				</div>
			</div>
		</div>

		<!-- Divider -->
		<hr class="border-gray-200 mb-6" />

		<!-- Bottom Row -->
		<div class="flex flex-col sm:flex-row items-center justify-between gap-2">
			<p class="font-body text-xs text-physics-dark/30">
				{content['bottom-left'] ?? 'Society of Physics Students at UIC'}
			</p>
			<p class="font-body text-xs text-physics-dark/30">
				{content['bottom-right'] ?? 'Physics Club'}
			</p>
		</div>
	</div>
</footer>
