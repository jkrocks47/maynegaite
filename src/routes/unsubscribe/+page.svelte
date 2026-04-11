<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<svelte:head>
	<title>Email Preferences - Maynegaite POA</title>
</svelte:head>

<div class="min-h-screen bg-mg-ivory py-12 px-4 flex items-center justify-center">
	<div class="w-full max-w-xl card-premium text-center">
		<h1 class="font-display text-4xl text-mg-forest mb-2">Maynegaite POA</h1>
		<p class="text-sm text-mg-warmGray mb-8">Email Preferences</p>

		{#if form?.unsubscribed}
			<div class="text-5xl text-mg-forest mb-3" aria-hidden="true">&#10003;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Unsubscribed</h2>
			<p class="text-mg-warmGray mb-4">You will no longer receive community reminders and announcements. Account-security emails will still be sent.</p>
			<form method="POST" action="?/resubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="btn-secondary">Resubscribe</button>
			</form>
		{:else if form?.resubscribed}
			<div class="text-5xl text-mg-forest mb-3" aria-hidden="true">&#10003;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Resubscribed</h2>
			<p class="text-mg-warmGray mb-4">You are subscribed again and will receive community reminders.</p>
			<a href="/dashboard" class="btn-primary">Go to Dashboard</a>
		{:else if form?.error}
			<div class="text-5xl text-mg-burgundy mb-3" aria-hidden="true">&#10007;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Something Went Wrong</h2>
			<p class="text-mg-warmGray">{form.error}</p>
		{:else if !data.valid}
			<div class="text-5xl text-mg-burgundy mb-3" aria-hidden="true">&#10007;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Invalid Link</h2>
			<p class="text-mg-warmGray mb-4">This link is not valid. Use your profile settings to manage email preferences.</p>
			<a href="/dashboard/profile" class="btn-primary">Go to Profile</a>
		{:else if data.optedOut}
			<div class="text-5xl text-mg-goldDark mb-3" aria-hidden="true">&#9993;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Already Unsubscribed</h2>
			<p class="text-mg-warmGray mb-4">You are already unsubscribed from community reminders.</p>
			<form method="POST" action="?/resubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="btn-secondary">Resubscribe</button>
			</form>
		{:else}
			<div class="text-5xl text-mg-goldDark mb-3" aria-hidden="true">&#9993;</div>
			<h2 class="font-display text-2xl text-mg-charcoal mb-2">Unsubscribe</h2>
			<p class="text-mg-warmGray mb-4">Stop receiving reminders and announcements for events and community updates.</p>
			<form method="POST" action="?/unsubscribe" use:enhance>
				<input type="hidden" name="token" value={data.token} />
				<button type="submit" class="btn-primary">Unsubscribe</button>
			</form>
		{/if}
	</div>
</div>
