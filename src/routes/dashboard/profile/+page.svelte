<script lang="ts">
	import { enhance } from '$app/forms';
	import { SECTIONS, SECTION_LABELS } from '$lib/utils/constants';

	let { data, form } = $props();
	let uploading = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);
</script>

<svelte:head>
	<title>Profile - Maynegaite POA</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-4">
	<h1 class="font-display text-3xl text-mg-charcoal">Profile</h1>

	{#if form?.success}
		<div class="rounded-lg border border-mg-forest/20 bg-mg-forest/10 px-4 py-3 text-sm text-mg-forest">Profile updated successfully.</div>
	{/if}
	{#if form?.error}
		<div class="rounded-lg border border-mg-burgundy/20 bg-mg-burgundy/10 px-4 py-3 text-sm text-mg-burgundy">{form.error}</div>
	{/if}

	<section class="card-elevated">
		<div class="flex items-center justify-between gap-4 mb-4">
			<h2 class="font-display text-2xl text-mg-charcoal">Profile Photo</h2>
			{#if data.profile.role === 'board'}
				<span class="badge badge-gold">Shown on board page</span>
			{/if}
		</div>

		{#if form?.photoError}
			<div class="rounded-lg border border-mg-burgundy/20 bg-mg-burgundy/10 px-4 py-3 text-sm text-mg-burgundy mb-3">{form.photoError}</div>
		{/if}
		{#if form?.photoSuccess}
			<div class="rounded-lg border border-mg-forest/20 bg-mg-forest/10 px-4 py-3 text-sm text-mg-forest mb-3">Photo updated.</div>
		{/if}
		{#if form?.photoRemoved}
			<div class="rounded-lg border border-mg-forest/20 bg-mg-forest/10 px-4 py-3 text-sm text-mg-forest mb-3">Photo removed.</div>
		{/if}

		<div class="flex flex-col sm:flex-row sm:items-center gap-4">
			{#if data.profile.profileImageUrl}
				<img src="{data.profile.profileImageUrl}?variant=thumbnail" alt="Profile" class="w-24 h-24 rounded-full object-cover border border-mg-stone" />
			{:else}
				<div class="w-24 h-24 rounded-full bg-mg-parchment border border-mg-stone text-mg-charcoal flex items-center justify-center text-2xl font-semibold">
					{data.profile.firstName.charAt(0)}{data.profile.lastName.charAt(0)}
				</div>
			{/if}

			<div class="space-y-2">
				<form
					method="POST"
					action="?/uploadPhoto"
					enctype="multipart/form-data"
					use:enhance={() => {
						uploading = true;
						return async ({ update }) => {
							uploading = false;
							await update({ reset: false });
						};
					}}
				>
					<input
						bind:this={fileInput}
						type="file"
						name="photo"
						accept="image/jpeg,image/png,image/webp,image/gif"
						class="hidden"
						onchange={(e) => e.currentTarget.form?.requestSubmit()}
					/>
					<button type="button" class="btn-secondary text-sm" disabled={uploading} onclick={() => fileInput?.click()}>
						{uploading ? 'Uploading...' : data.profile.profileImageUrl ? 'Change Photo' : 'Upload Photo'}
					</button>
				</form>

				{#if data.profile.profileImageUrl}
					<form
						method="POST"
						action="?/removePhoto"
						use:enhance={() => {
							return async ({ update }) => {
								await update({ reset: false });
							};
						}}
					>
						<button type="submit" class="text-sm text-mg-burgundy hover:underline">Remove Photo</button>
					</form>
				{/if}
			</div>
		</div>
		<p class="text-xs text-mg-warmGray mt-3">JPEG, PNG, WebP, or GIF. Maximum 25MB.</p>
	</section>

	<section class="card-elevated">
		<form
			method="POST"
			action="?/update"
			use:enhance={() => {
				return async ({ update }) => {
					await update({ reset: false });
				};
			}}
			class="space-y-4"
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="firstName" class="block text-sm font-medium text-mg-charcoal mb-1">First Name *</label>
					<input type="text" id="firstName" name="firstName" required value={data.profile.firstName} class="input" />
				</div>
				<div>
					<label for="lastName" class="block text-sm font-medium text-mg-charcoal mb-1">Last Name *</label>
					<input type="text" id="lastName" name="lastName" required value={data.profile.lastName} class="input" />
				</div>
			</div>

			<div>
				<label for="emailReadOnly" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
				<input id="emailReadOnly" type="email" disabled value={data.profile.email} class="input opacity-70" />
				<p class="text-xs text-mg-warmGray mt-1">Email cannot be changed here.</p>
			</div>

			<div>
				<label for="secondaryEmail" class="block text-sm font-medium text-mg-charcoal mb-1">Secondary Email</label>
				<input type="email" id="secondaryEmail" name="secondaryEmail" value={data.profile.secondaryEmail ?? ''} placeholder="Optional backup email" class="input" />
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label for="phone" class="block text-sm font-medium text-mg-charcoal mb-1">Phone</label>
					<input type="tel" id="phone" name="phone" value={data.profile.phone ?? ''} placeholder="Optional phone number" class="input" />
				</div>
				<div>
					<label for="lotNumber" class="block text-sm font-medium text-mg-charcoal mb-1">Lot Number</label>
					<input type="number" id="lotNumber" name="lotNumber" min="1" max="197" value={data.profile.lotNumber ?? ''} class="input" />
				</div>
			</div>

			<div>
				<label for="address" class="block text-sm font-medium text-mg-charcoal mb-1">Property Address</label>
				<input type="text" id="address" name="address" value={data.profile.address ?? ''} placeholder="Street address" class="input" />
			</div>

			<div>
				<label for="section" class="block text-sm font-medium text-mg-charcoal mb-1">Section</label>
				<select id="section" name="section" class="input">
					<option value="">Select...</option>
					{#each SECTIONS as s}
						<option value={s} selected={data.profile.section === s}>{SECTION_LABELS[s]}</option>
					{/each}
				</select>
			</div>

			<div class="space-y-2 pt-2 border-t border-mg-stone">
				<label class="flex items-center gap-2 text-sm text-mg-charcoal cursor-pointer">
					<input type="checkbox" name="directoryOptIn" checked={data.profile.directoryOptIn} class="accent-mg-forest" />
					Include my household in the community directory.
				</label>
				<label class="flex items-center gap-2 text-sm text-mg-charcoal cursor-pointer">
					<input type="checkbox" name="emailOptOut" checked={data.profile.emailOptOut} class="accent-mg-forest" />
					Opt out of event reminders and announcements.
				</label>
				<p class="text-xs text-mg-warmGray">Account-security emails are always sent.</p>
			</div>

			<button type="submit" class="btn-primary">Save Changes</button>
		</form>
	</section>
</div>
