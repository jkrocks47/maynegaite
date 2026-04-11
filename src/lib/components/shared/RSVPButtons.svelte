<script lang="ts">
	import { RSVP_STATUSES } from "$lib/utils/constants";

	let {
		eventId,
		currentStatus = null,
		isLoggedIn = false,
		redirectTo = ""
	}: {
		eventId: string;
		currentStatus: any;
		isLoggedIn: boolean;
		redirectTo?: string;
	} = $props();

	let status = $state(currentStatus);
	let loading = $state(false);

	const goingClass = $derived(
		status === "going" 
			? "bg-green-100 border-green-300 text-green-700" 
			: "bg-gray-50 border-gray-200 text-mg-warmGray hover:border-mg-stone hover:text-mg-charcoal"
	);
	const maybeClass = $derived(
		status === "maybe" 
			? "bg-yellow-100 border-yellow-300 text-yellow-700" 
			: "bg-gray-50 border-gray-200 text-mg-warmGray hover:border-mg-stone hover:text-mg-charcoal"
	);
	const notGoingClass = $derived(
		status === "not_going" 
			? "bg-red-100 border-red-300 text-red-700" 
			: "bg-gray-50 border-gray-200 text-mg-warmGray hover:border-mg-stone hover:text-mg-charcoal"
	);

	async function handleRsvp(newStatus: string) {
		if (loading) return;
		loading = true;
		try {
			const res = await fetch("/api/member/rsvp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ eventId, status: newStatus })
			});
			if (res.ok) { status = newStatus; }
		} finally {
			loading = false;
		}
	}
</script>

{#if !isLoggedIn}
	<div class="flex items-center gap-2 mt-2 font-ui">
		<a href="/login{redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}" class="text-sm font-medium text-mg-forest hover:underline">Sign in to RSVP</a>
	</div>
{:else}
	<div class="flex flex-wrap items-center gap-2 mt-2">
		<button
			class="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors border disabled:opacity-50 disabled:cursor-not-allowed {goingClass}"
			disabled={loading}
			onclick={() => handleRsvp("going")}
		>Going</button>
		<button
			class="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors border disabled:opacity-50 disabled:cursor-not-allowed {maybeClass}"
			disabled={loading}
			onclick={() => handleRsvp("maybe")}
		>Maybe</button>
		<button
			class="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors border disabled:opacity-50 disabled:cursor-not-allowed {notGoingClass}"
			disabled={loading}
			onclick={() => handleRsvp("not_going")}
		>Not Going</button>
	</div>
{/if}
