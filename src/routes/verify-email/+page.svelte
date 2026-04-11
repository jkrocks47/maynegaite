<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let resending = $state(false);
	let cooldown = $state(false);

	$effect(() => {
		if (form?.resent) {
			cooldown = true;
			const timer = setTimeout(() => {
				cooldown = false;
			}, 3 * 60 * 1000);
			return () => clearTimeout(timer);
		}
	});
</script>

<svelte:head>
	<title>Verify Email - Maynegaite POA</title>
</svelte:head>

<div class="min-h-screen bg-mg-ivory py-12 px-4 flex items-center justify-center">
	<div class="w-full max-w-xl card-premium text-center">
		<h1 class="font-display text-4xl text-mg-forest mb-2">Maynegaite POA</h1>
		<p class="text-sm text-mg-warmGray mb-8">Account Verification</p>

		{#if data.verified || form?.verified}
			<div class="text-5xl text-mg-forest mb-3" aria-hidden="true">&#10003;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Email Verified</h2>
			<p class="text-mg-warmGray mb-5">Your account is ready. You can now continue to your homeowner dashboard.</p>
			<a href="/dashboard" class="btn-primary">Go to Dashboard</a>
		{:else if data.tokenValid}
			<div class="text-5xl text-mg-goldDark mb-3" aria-hidden="true">&#9993;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Confirm Your Email</h2>
			<p class="text-mg-warmGray mb-5">Select the button below to activate your Maynegaite POA account.</p>
			{#if form?.verifyError}
				<div class="mb-4 rounded-lg border border-mg-burgundy/20 bg-mg-burgundy/10 px-4 py-3 text-sm text-mg-burgundy">{form.verifyError}</div>
			{/if}
			<form
				method="POST"
				action="?/verify"
				use:enhance={() => {
					resending = true;
					return async ({ update }) => {
						resending = false;
						await update();
					};
				}}
			>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="btn-primary" disabled={resending}>
					{resending ? 'Verifying...' : 'Verify My Email'}
				</button>
			</form>
		{:else if data.error || form?.verifyError}
			<div class="text-5xl text-mg-burgundy mb-3" aria-hidden="true">&#10007;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Verification Failed</h2>
			<p class="text-mg-warmGray mb-4">{data.error || form?.verifyError}</p>
			<a href="/login" class="btn-primary">Sign In</a>
			<p class="text-sm text-mg-warmGray mt-4">
				Need a new link? <a href="/verify-email" class="text-mg-forest hover:underline">Resend verification email</a>
			</p>
		{:else}
			<div class="text-5xl text-mg-goldDark mb-3" aria-hidden="true">&#9993;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Check Your Inbox</h2>
			<p class="text-mg-warmGray mb-4">
				We sent your verification link by email. Open the message and follow the link to finish setup.
			</p>

			<div class="mb-4 rounded-lg border border-mg-stone bg-mg-parchment px-4 py-3 text-sm text-mg-warmGray">
				Delivery can take a few minutes. Check spam or junk folders if needed.
			</div>

			{#if form?.resent}
				<div class="mb-4 rounded-lg border border-mg-forest/20 bg-mg-forest/10 px-4 py-3 text-sm text-mg-forest">Verification email sent.</div>
			{/if}

			{#if form?.resendError}
				<div class="mb-4 rounded-lg border border-mg-burgundy/20 bg-mg-burgundy/10 px-4 py-3 text-sm text-mg-burgundy">{form.resendError}</div>
			{/if}

			<form
				method="POST"
				action="?/resend"
				use:enhance={() => {
					resending = true;
					return async ({ update }) => {
						resending = false;
						await update();
					};
				}}
			>
				<button type="submit" class="btn-secondary" disabled={resending || cooldown}>
					{#if resending}
						Sending...
					{:else if cooldown}
						Email Sent - Check Your Inbox
					{:else}
						Resend Verification Email
					{/if}
				</button>
			</form>

			<p class="text-sm text-mg-warmGray mt-4">
				Already verified? <a href="/login" class="text-mg-forest hover:underline">Sign in</a>
			</p>

			<form method="POST" action="?/logout" use:enhance class="mt-4">
				<button type="submit" class="text-sm text-mg-warmGray hover:text-mg-charcoal underline underline-offset-4">Log Out</button>
			</form>
		{/if}
	</div>
</div>
