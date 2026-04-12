<script lang="ts">
	import { enhance } from '$app/forms';
	import { SECTIONS, SECTION_LABELS } from '$lib/utils/constants';
	import BotProtection from '$lib/components/shared/BotProtection.svelte';
	import SEO from '$lib/components/shared/SEO.svelte';

	type RegisterForm = {
		error?: string;
		email?: string;
		firstName?: string;
		lastName?: string;
	};

	let { form, data }: {
		form?: RegisterForm;
		data: { redirectTo: string | null; challenge: string; difficulty: number };
	} = $props();

	let step = $state(1);
	let firstName = $state(form?.firstName ?? '');
	let lastName = $state(form?.lastName ?? '');
	let email = $state(form?.email ?? '');
	let password = $state('');
	let phone = $state('');
	let address = $state('');
	let lotNumber = $state('');
	let section = $state('');
</script>

<SEO title="Register" />

<div class="min-h-[70vh] flex items-center justify-center py-16 px-4">
	<div class="w-full max-w-lg">
		<div class="card-elevated">
			<div class="text-center mb-8">
				<h1 class="font-display text-3xl font-bold text-mg-forest">Join Maynegaite POA</h1>
				<p class="text-sm text-mg-warmGray mt-1">Create your homeowner account</p>
			</div>

			<!-- Step indicators -->
			<div class="flex items-center justify-center gap-2 mb-8">
				<div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium {step >= 1 ? 'bg-mg-forest text-white' : 'bg-mg-stone text-mg-warmGray'}">1</div>
				<div class="w-8 h-0.5 {step >= 2 ? 'bg-mg-forest' : 'bg-mg-stone'}"></div>
				<div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium {step >= 2 ? 'bg-mg-forest text-white' : 'bg-mg-stone text-mg-warmGray'}">2</div>
			</div>

			{#if form?.error}
				<div class="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">{form.error}</div>
			{/if}

			<form method="POST" action="?/register" use:enhance>
				{#if data.redirectTo}
					<input type="hidden" name="redirectTo" value={data.redirectTo} />
				{/if}

				<BotProtection challenge={data.challenge} difficulty={data.difficulty} />

				{#if step === 1}
					<!-- Step 1: Account Info -->
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="firstName" class="block text-sm font-medium text-mg-charcoal mb-1">First Name</label>
								<input id="firstName" name="firstName" type="text" required class="input" bind:value={firstName} />
							</div>
							<div>
								<label for="lastName" class="block text-sm font-medium text-mg-charcoal mb-1">Last Name</label>
								<input id="lastName" name="lastName" type="text" required class="input" bind:value={lastName} />
							</div>
						</div>
						<div>
							<label for="email" class="block text-sm font-medium text-mg-charcoal mb-1">Email</label>
							<input id="email" name="email" type="email" required class="input" placeholder="your@email.com" bind:value={email} />
						</div>
						<div>
							<label for="password" class="block text-sm font-medium text-mg-charcoal mb-1">Password</label>
							<input id="password" name="password" type="password" required minlength="8" class="input" bind:value={password} />
							<p class="text-xs text-mg-warmGray mt-1">Min 8 characters, 1 uppercase, 1 number</p>
						</div>
						<button type="button" class="btn-primary w-full" onclick={() => { if (firstName && lastName && email && password.length >= 8) step = 2; }}>
							Continue
						</button>
					</div>
				{:else}
					<!-- Step 2: Property Info -->
					<input type="hidden" name="firstName" value={firstName} />
					<input type="hidden" name="lastName" value={lastName} />
					<input type="hidden" name="email" value={email} />
					<input type="hidden" name="password" value={password} />

					<div class="space-y-4">
						<div>
							<label for="phone" class="block text-sm font-medium text-mg-charcoal mb-1">Phone (optional)</label>
							<input id="phone" name="phone" type="tel" class="input" bind:value={phone} />
						</div>
						<div>
							<label for="address" class="block text-sm font-medium text-mg-charcoal mb-1">Property Address (optional)</label>
							<input id="address" name="address" type="text" class="input" placeholder="e.g., 3015 London Dr" bind:value={address} />
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<label for="lotNumber" class="block text-sm font-medium text-mg-charcoal mb-1">Lot Number (optional)</label>
								<input id="lotNumber" name="lotNumber" type="number" min="1" max="197" class="input" bind:value={lotNumber} />
							</div>
							<div>
								<label for="section" class="block text-sm font-medium text-mg-charcoal mb-1">Section (optional)</label>
								<select id="section" name="section" class="input" bind:value={section}>
									<option value="">Select...</option>
									{#each SECTIONS as s}
										<option value={s}>{SECTION_LABELS[s]}</option>
									{/each}
								</select>
							</div>
						</div>



						<div class="flex gap-3">
							<button type="button" class="btn-secondary flex-1" onclick={() => (step = 1)}>Back</button>
							<button type="submit" class="btn-primary flex-1">Create Account</button>
						</div>
					</div>
				{/if}
			</form>

			<div class="mt-6 text-center">
				<p class="text-sm text-mg-warmGray">
					Already have an account? <a href="/login" class="text-mg-forest hover:underline">Sign In</a>
				</p>
			</div>
		</div>
	</div>
</div>
