<script lang="ts">
	import EditableText from '../EditableText.svelte';

	interface Props {
		content: Record<string, string>;
		clubType: string | null;
	}

	let { content, clubType }: Props = $props();

	const isAstro = clubType === 'astronomy';
	const slug = 'footer';
</script>

{#if isAstro}
	<!-- Astronomy Footer Preview -->
	<div class="relative bg-[#060810] border-t border-white/[0.04] pt-12 pb-8 overflow-hidden">
		<div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Info line -->
			<div class="mb-6">
				<div class="flex flex-wrap items-center gap-x-1 font-mono text-[10px] tracking-[0.25em] uppercase text-[#f5f0e8]/35 leading-relaxed">
					<EditableText
						value={content['org-name'] ?? ''}
						{slug}
						section="org-name"
						{clubType}
						fieldType="short"
						tag="span"
						label="Organization name in footer"
						class="font-mono text-[10px] tracking-[0.25em] uppercase text-[#f5f0e8]/35"
					/>
					<span class="text-white/[0.08]">/</span>
					<EditableText
						value={content['coordinates'] ?? ''}
						{slug}
						section="coordinates"
						{clubType}
						fieldType="short"
						tag="span"
						label="Location coordinates"
						class="font-mono text-[10px] tracking-[0.25em] uppercase text-[#f5f0e8]/35"
					/>
					<span class="text-white/[0.08]">/</span>
					<EditableText
						value={content['address'] ?? ''}
						{slug}
						section="address"
						{clubType}
						fieldType="short"
						tag="span"
						label="Address line"
						class="font-mono text-[10px] tracking-[0.25em] uppercase text-[#f5f0e8]/35"
					/>
					<span class="text-white/[0.08]">/</span>
					<EditableText
						value={content['building'] ?? ''}
						{slug}
						section="building"
						{clubType}
						fieldType="short"
						tag="span"
						label="Building name"
						class="font-mono text-[10px] tracking-[0.25em] uppercase text-[#f5f0e8]/35"
					/>
					<span class="text-white/[0.08]">/</span>
					<span class="text-[#f5f0e8]/25 italic text-[8px]">Contact email managed via Club Info panel</span>
				</div>
			</div>

			<!-- Classification line -->
			<div class="mb-6 flex items-center gap-4">
				<div class="h-px flex-1 bg-white/[0.04]"></div>
				<EditableText
					value={content['doc-ref'] ?? ''}
					{slug}
					section="doc-ref"
					{clubType}
					fieldType="short"
					tag="span"
					label="Document reference line"
					class="font-mono text-[8px] tracking-[0.4em] uppercase text-[#f5f0e8]/15"
				/>
				<div class="h-px flex-1 bg-white/[0.04]"></div>
			</div>

			<!-- Bottom Row -->
			<div class="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
				<div class="flex flex-col items-start gap-1.5">
					<!-- Barcode placeholder -->
					<div class="w-[280px] h-[28px] bg-[#f5f0e8]/[0.05] rounded"></div>
					<EditableText
						value={content['barcode-label'] ?? ''}
						{slug}
						section="barcode-label"
						{clubType}
						fieldType="short"
						tag="span"
						label="Barcode label text"
						class="font-mono text-[7px] tracking-[0.35em] text-[#f5f0e8]/10 uppercase"
					/>
				</div>

				<span class="text-[#f5f0e8]/25 italic text-[8px]">Social links managed via Club Info panel</span>
			</div>
		</div>
	</div>
{:else}
	<!-- Physics Footer Preview -->
	<div class="bg-gray-50 border-t border-gray-200 pt-10 pb-6">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<!-- Main Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
				<div>
					<EditableText
						value={content['org-name'] ?? ''}
						{slug}
						section="org-name"
						{clubType}
						fieldType="short"
						tag="p"
						label="Organization name in footer"
						class="font-body text-sm font-semibold text-[#191923] mb-3"
					/>
					<EditableText
						value={content['tagline'] ?? ''}
						{slug}
						section="tagline"
						{clubType}
						fieldType="short"
						tag="p"
						label="Footer tagline / description"
						class="font-body text-sm text-[#191923]/50"
					/>
				</div>
				<div>
					<p class="font-body text-sm font-semibold text-[#191923] mb-3">Contact</p>
					<p class="font-body text-sm text-[#191923]/50 italic">Email managed via Club Info panel</p>
					<EditableText
						value={content['institution'] ?? ''}
						{slug}
						section="institution"
						{clubType}
						fieldType="short"
						tag="p"
						label="Institution name"
						class="font-body text-sm text-[#191923]/50 mt-1"
					/>
				</div>
				<div>
					<p class="font-body text-sm font-semibold text-[#191923] mb-3">Follow Us</p>
					<p class="font-body text-sm text-[#191923]/50 italic">Social links managed via Club Info panel</p>
				</div>
			</div>

			<!-- Divider -->
			<hr class="border-gray-200 mb-6" />

			<!-- Bottom Row -->
			<div class="flex flex-col sm:flex-row items-center justify-between gap-2">
				<EditableText
					value={content['bottom-left'] ?? ''}
					{slug}
					section="bottom-left"
					{clubType}
					fieldType="short"
					tag="p"
					label="Bottom-left footer text"
					class="font-body text-xs text-[#191923]/30"
				/>
				<EditableText
					value={content['bottom-right'] ?? ''}
					{slug}
					section="bottom-right"
					{clubType}
					fieldType="short"
					tag="p"
					label="Bottom-right footer text"
					class="font-body text-xs text-[#191923]/30"
				/>
			</div>
		</div>
	</div>
{/if}
