<script lang="ts">
	import { enhance } from '$app/forms';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';

	let { form } = $props();
</script>

<svelte:head>
	<title>Forgot Password - Maynegaite POA</title>
</svelte:head>

<div class="min-h-screen bg-mg-ivory py-12 px-4 flex items-center justify-center">
	<div class="w-full max-w-md card-premium">
		<h1 class="font-display text-3xl text-mg-forest text-center mb-1">Maynegaite POA</h1>
		<p class="text-center text-sm text-mg-warmGray mb-6">Password Reset</p>

		{#if form?.success}
			<div class="rounded-lg border border-mg-forest/20 bg-mg-forest/10 px-4 py-3 text-sm text-mg-forest mb-4">
				If an account exists for that email, we sent a reset link. Please check your inbox.
			</div>
		{:else}
			{#if form?.error}
				<div class="rounded-lg border border-mg-burgundy/20 bg-mg-burgundy/10 px-4 py-3 text-sm text-mg-burgundy mb-4">{form.error}</div>
			{/if}

			<p class="text-sm text-mg-warmGray mb-4">Enter your email address and we will send a link to reset your password.</p>

			<form method="POST" action="?/request" use:enhance>
				<BotProtection />
				<div class="mb-4">
					<label for="email" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
					<input type="email" id="email" name="email" required placeholder="your@email.com" class="input" />
				</div>

				<button type="submit" class="btn-primary w-full">Send Reset Link</button>
			</form>
		{/if}

		<a href="/login" class="inline-block mt-5 text-sm text-mg-forest hover:underline">&larr; Back to sign in</a>
	</div>
</div>
