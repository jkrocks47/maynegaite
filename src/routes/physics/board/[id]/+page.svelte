<script lang="ts">
	let { data } = $props();

	const member = data.member;
	const image = member.memberProfileImage || member.imageUrl;
	const displayName = member.memberId ? `${member.memberFirstName} ${member.memberLastName}` : member.name;
</script>

<svelte:head>
	<title>{displayName} | Board | Society of Physics Students at UIC</title>
</svelte:head>

<section class="min-h-screen px-4 sm:px-6 lg:px-8 py-24">
	<div class="max-w-2xl mx-auto">
		<!-- Back link -->
		<a
			href="/physics/board"
			class="inline-flex items-center gap-2 font-body text-sm text-physics-blue/70 hover:text-physics-blue transition-colors no-underline mb-8"
		>
			<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Board
		</a>

		<div class="bg-white rounded-2xl border border-gray-100 p-8 sm:p-10">
			<div class="text-center mb-8">
				{#if image}
					<img
						src={image}
						alt={displayName}
						class="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
					/>
				{:else}
					<div class="w-32 h-32 rounded-full mx-auto mb-6 bg-physics-blue/10 flex items-center justify-center">
						<span class="font-display text-4xl text-physics-blue/50">
							{displayName.charAt(0)}
						</span>
					</div>
				{/if}

				<h1 class="font-display text-3xl sm:text-4xl font-bold text-physics-dark">{displayName}</h1>
				<p class="font-body text-base text-physics-blue mt-2">{member.position}</p>

				{#if member.memberYear || member.memberMajor}
					<p class="font-body text-sm text-physics-dark/40 mt-2">
						{[member.memberYear, member.memberMajor].filter(Boolean).join(' · ')}
					</p>
				{/if}

				{#if member.email}
					<a
						href="mailto:{member.email}"
						class="inline-block font-body text-xs text-physics-blue/70 hover:text-physics-blue mt-3 transition-colors no-underline"
					>
						{member.email}
					</a>
				{/if}
			</div>

			{#if member.bio}
				<div class="mt-6 pt-6 border-t border-gray-100">
					<p class="font-body text-xs tracking-widest text-physics-dark/40 uppercase mb-3">Bio</p>
					<p class="font-body text-base text-physics-dark/70 leading-relaxed whitespace-pre-line">{member.bio}</p>
				</div>
			{/if}
		</div>
	</div>
</section>
