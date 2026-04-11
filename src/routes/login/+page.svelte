<script lang="ts">
	import { enhance } from '$app/forms';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';
	import SEO from '$lib/components/shared/SEO.svelte';

	let { form, data } = $props();
</script>

<SEO title="Sign In" />

<div class="min-h-[70vh] flex items-center justify-center py-16 px-4">
	<div class="w-full max-w-md">
		<div class="card-elevated">
			<div class="text-center mb-8">
				<h1 class="font-display text-3xl font-bold text-mg-forest">Maynegaite POA</h1>
				<p class="text-sm text-mg-warmGray mt-1">Sign in to your account</p>
			</div>

			{#if form?.error}
				<div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{form.error}</div>
			{/if}

			<form method="POST" action="?/login" use:enhance>
				{#if data.redirectTo}
					<input type="hidden" name="redirectTo" value={data.redirectTo} />
				{/if}

				<div class="space-y-4">
					<div>
						<label for="email" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
						<input id="email" name="email" type="email" required autocomplete="email" class="input" placeholder="your@email.com" value={(form as any)?.email ?? ''} />
					</div>
					<div>
						<label for="password" class="block text-sm font-medium text-mg-charcoal mb-1">Password</label>
						<input id="password" name="password" type="password" required autocomplete="current-password" class="input" />
					</div>

					<BotProtection />

					<button type="submit" class="btn-primary w-full">Sign In</button>
				</div>
			</form>

			<div class="mt-6 text-center space-y-2">
				<a href="/forgot-password" class="text-sm text-mg-forest hover:underline block">Forgot your password?</a>
				<p class="text-sm text-mg-warmGray">
					Don't have an account? <a href="/register" class="text-mg-forest hover:underline">Register</a>
				</p>
			</div>
		</div>
	</div>
</div>
