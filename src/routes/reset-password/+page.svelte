<script lang="ts">
	import { enhance } from '$app/forms';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Reset Password - Maynegaite POA</title>
</svelte:head>

<div class="min-h-screen bg-mg-ivory py-12 px-4 flex items-center justify-center">
	<div class="w-full max-w-md card-premium">
		<h1 class="font-display text-3xl text-mg-forest text-center mb-1">Maynegaite POA</h1>
		<p class="text-center text-sm text-mg-warmGray mb-6">Set New Password</p>

		{#if form?.success}
			<div class="rounded-lg border border-mg-forest/20 bg-mg-forest/10 px-4 py-3 text-sm text-mg-forest mb-4 text-center">
				Your password was reset successfully.
			</div>
			<a href="/login" class="btn-primary w-full text-center">Sign In</a>
		{:else}
			{#if form?.error}
				<div class="rounded-lg border border-mg-burgundy/20 bg-mg-burgundy/10 px-4 py-3 text-sm text-mg-burgundy mb-4">{form.error}</div>
			{/if}

			<form method="POST" action="?/reset" use:enhance>
				<BotProtection />
				<input type="hidden" name="token" value={data.token} />

				<div class="mb-4">
					<label for="password" class="block text-sm font-medium text-mg-charcoal mb-1">New Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						minlength="8"
						placeholder="Minimum 8 chars, 1 uppercase, 1 number"
						class="input"
					/>
				</div>

				<button type="submit" class="btn-primary w-full">Reset Password</button>
			</form>
		{/if}
	</div>
</div>
