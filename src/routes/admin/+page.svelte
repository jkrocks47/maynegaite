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
	<div class="min-h-[70vh] flex items-center justify-center py-16 px-4">
		<div class="w-full max-w-md">
			<div class="card-elevated">
				<div class="text-center mb-8">
					<h1 class="font-display text-3xl font-bold text-mg-forest">Admin Login</h1>
					<p class="text-sm text-mg-warmGray mt-1">Maynegaite POA Administration</p>
				</div>

				{#if form?.error}
					<div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{form.error}</div>
				{/if}

				<form method="POST" action="?/login" use:enhance>
					<div class="space-y-4">
						<div>
							<label for="email" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
							<input id="email" name="email" type="email" required class="input" />
						</div>
						<div>
							<label for="password" class="block text-sm font-medium text-mg-charcoal mb-1">Password</label>
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
		<div class="max-w-6xl mx-auto">
		<h1 class="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>

		{#if stats}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div class="card-elevated text-center py-6">
					<p class="text-3xl font-bold text-mg-forest">{stats.totalMembers}</p>
					<p class="text-sm text-mg-warmGray mt-1">Total Members</p>
				</div>
				<div class="card-elevated text-center py-6">
					<p class="text-3xl font-bold text-mg-forest">{stats.woodsMembers}</p>
					<p class="text-sm text-mg-warmGray mt-1">Maynegaite Woods</p>
				</div>
				<div class="card-elevated text-center py-6">
					<p class="text-3xl font-bold text-mg-forest">{stats.reservesMembers}</p>
					<p class="text-sm text-mg-warmGray mt-1">The Reserves</p>
				</div>
				<div class="card-elevated text-center py-6">
					<p class="text-3xl font-bold text-mg-forest">{stats.verifiedMembers}</p>
					<p class="text-sm text-mg-warmGray mt-1">Verified</p>
				</div>
			</div>
		{/if}

			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<a href="/admin/members" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">👥</p>
					<p class="font-semibold text-mg-charcoal">Members</p>
				</a>
				<a href="/admin/events" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">📅</p>
					<p class="font-semibold text-mg-charcoal">Events</p>
				</a>
				<a href="/admin/gallery" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">🖼️</p>
					<p class="font-semibold text-mg-charcoal">Gallery</p>
				</a>
				<a href="/admin/officers" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">🧑‍💼</p>
					<p class="font-semibold text-mg-charcoal">Officers</p>
				</a>
				<a href="/admin/announcements" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">📢</p>
					<p class="font-semibold text-mg-charcoal">Announcements</p>
				</a>
				<a href="/admin/properties" class="card-elevated hover-lift text-center py-8 no-underline">
				<p class="text-2xl mb-2">🏠</p>
				<p class="font-semibold text-mg-charcoal">Properties</p>
			</a>
				<a href="/admin/documents" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">📄</p>
					<p class="font-semibold text-mg-charcoal">Documents</p>
				</a>
				<a href="/admin/architectural" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">📐</p>
					<p class="font-semibold text-mg-charcoal">Architectural</p>
				</a>
				<a href="/admin/violations" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">⚖️</p>
					<p class="font-semibold text-mg-charcoal">Violations</p>
				</a>
				<a href="/admin/content" class="card-elevated hover-lift text-center py-8 no-underline">
					<p class="text-2xl mb-2">✏️</p>
					<p class="font-semibold text-mg-charcoal">Site Content</p>
				</a>
			</div>
	</div>
{/if}
