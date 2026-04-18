<script lang="ts">
	import { enhance } from '$app/forms';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';

	let { data, form } = $props();

	let member = $derived(data.member);
	let stats = $derived(data.membershipStats);
</script>

<svelte:head>
	<title>{member?.adminRole ? 'Admin Dashboard' : 'Admin Login'} - Maynegaite POA</title>
</svelte:head>

{#if !member?.adminRole}
	<!-- Admin Login -->
	<div class="flex min-h-[70vh] items-center justify-center px-4 py-16">
		<div class="w-full max-w-md">
			<div class="card-elevated">
				<div class="mb-8 text-center">
					<h1 class="font-display text-3xl font-bold text-mg-forest">Admin Login</h1>
					<p class="mt-1 text-sm text-mg-warmGray">Maynegaite POA Administration</p>
				</div>

				{#if form?.error}
					<div class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</div>
				{/if}

				<form method="POST" action="?/login" use:enhance>
					<div class="space-y-4">
						<div>
							<label for="email" class="mb-1 block text-sm font-medium text-mg-charcoal"
								>Email</label
							>
							<input id="email" name="email" type="email" required class="input" />
						</div>
						<div>
							<label for="password" class="mb-1 block text-sm font-medium text-mg-charcoal"
								>Password</label
							>
							<input id="password" name="password" type="password" required class="input" />
						</div>
						<BotProtection />
						<button type="submit" class="btn-primary w-full">Sign In</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{:else}
	<!-- Admin Dashboard -->
	<div class="mx-auto max-w-6xl">
		<h1 class="mb-8 text-2xl font-bold text-gray-800">Dashboard</h1>

		{#if stats}
			<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div class="card-elevated py-6 text-center">
					<p class="text-3xl font-bold text-mg-forest">{stats.totalMembers}</p>
					<p class="mt-1 text-sm text-mg-warmGray">Total Members</p>
				</div>
				<div class="card-elevated py-6 text-center">
					<p class="text-3xl font-bold text-mg-forest">{stats.woodsMembers}</p>
					<p class="mt-1 text-sm text-mg-warmGray">Maynegaite</p>
				</div>
				<div class="card-elevated py-6 text-center">
					<p class="text-3xl font-bold text-mg-forest">{stats.verifiedMembers}</p>
					<p class="mt-1 text-sm text-mg-warmGray">Verified</p>
				</div>
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<a href="/admin/members" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">👥</p>
				<p class="font-semibold text-mg-charcoal">Members</p>
			</a>
			<a href="/admin/events" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">📅</p>
				<p class="font-semibold text-mg-charcoal">Events</p>
			</a>
			<a href="/admin/gallery" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">🖼️</p>
				<p class="font-semibold text-mg-charcoal">Gallery</p>
			</a>
			<a href="/admin/officers" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">🧑‍💼</p>
				<p class="font-semibold text-mg-charcoal">Officers</p>
			</a>
			<a href="/admin/announcements" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">📢</p>
				<p class="font-semibold text-mg-charcoal">Announcements</p>
			</a>
			<a href="/admin/properties" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">🏠</p>
				<p class="font-semibold text-mg-charcoal">Properties</p>
			</a>
			<a href="/admin/documents" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">📄</p>
				<p class="font-semibold text-mg-charcoal">Documents</p>
			</a>
			<a href="/admin/architectural" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">📐</p>
				<p class="font-semibold text-mg-charcoal">Architectural</p>
			</a>
			<a href="/admin/violations" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">⚖️</p>
				<p class="font-semibold text-mg-charcoal">Violations</p>
			</a>
			<a href="/admin/content" class="card-elevated hover-lift py-8 text-center no-underline">
				<p class="mb-2 text-2xl">✏️</p>
				<p class="font-semibold text-mg-charcoal">Site Content</p>
			</a>
			<a
				href="/admin/handbook"
				target="_blank"
				rel="noopener"
				class="card-elevated hover-lift py-8 text-center no-underline"
			>
				<p class="mb-2 text-2xl">📘</p>
				<p class="font-semibold text-mg-charcoal">Board Handbook</p>
			</a>
		</div>
	</div>
{/if}
