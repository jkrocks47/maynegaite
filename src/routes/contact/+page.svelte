<script lang="ts">
	import { enhance } from '$app/forms';
	import SEO from '$lib/components/shared/SEO.svelte';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';
	let { data, form } = $props();
</script>

<SEO title="Contact Us" description="Get in touch with the Maynegaite Property Owners' Association board." />

<div class="py-16 px-4">
	<div class="max-w-4xl mx-auto">
		<h1 class="font-display text-4xl font-bold text-mg-charcoal mb-12">Contact Us</h1>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<!-- Contact Form -->
			<div class="md:col-span-2">
				{#if form?.success}
					<div class="card-elevated bg-green-50 border-green-200 text-center py-8">
						<p class="text-green-800 text-lg font-medium">Message sent successfully!</p>
						<p class="text-green-600 text-sm mt-2">We'll get back to you as soon as possible.</p>
					</div>
				{:else}
					<form method="POST" action="?/send" use:enhance class="card-elevated">
						<h2 class="font-display text-xl font-bold text-mg-charcoal mb-6">Send a Message</h2>

						{#if form?.error}
							<div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{form.error}</div>
						{/if}

						<div class="space-y-4">
							<div>
								<label for="name" class="block text-sm font-medium text-mg-charcoal mb-1">Name</label>
								<input id="name" name="name" type="text" required class="input" placeholder="Your name" />
							</div>
							<div>
								<label for="email" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
								<input id="email" name="email" type="email" required class="input" placeholder="your@email.com" />
							</div>
							<div>
								<label for="message" class="block text-sm font-medium text-mg-charcoal mb-1">Message</label>
								<textarea id="message" name="message" rows="5" required class="input" placeholder="How can we help?"></textarea>
							</div>

							<BotProtection />

							<button type="submit" class="btn-primary w-full">Send Message</button>
						</div>
					</form>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<div class="card-elevated">
					<h3 class="font-semibold text-mg-charcoal mb-3">Mailing Address</h3>
					<p class="text-sm text-mg-warmGray">
						Maynegaite POA<br />
						P.O. Box 214<br />
						Olympia Fields, IL 60461
					</p>
				</div>

				{#if data.communityInfo?.contactEmail}
					<div class="card-elevated">
						<h3 class="font-semibold text-mg-charcoal mb-3">Email</h3>
						<a href="mailto:{data.communityInfo.contactEmail}" class="text-sm text-mg-forest hover:underline">
							{data.communityInfo.contactEmail}
						</a>
					</div>
				{/if}

				<div class="card-elevated">
					<h3 class="font-semibold text-mg-charcoal mb-3">Emergency</h3>
					<p class="text-sm text-mg-warmGray">
						Village of Olympia Fields<br />
						<a href="tel:7085038000" class="text-mg-forest hover:underline">(708) 503-8000</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>
