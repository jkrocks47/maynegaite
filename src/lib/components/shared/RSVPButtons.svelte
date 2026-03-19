<script lang="ts">
	import type { RsvpStatus } from '$lib/utils/constants';

	let {
		eventId,
		currentStatus = null,
		isLoggedIn = false,
		isVerified = false,
		redirectTo = ''
	}: {
		eventId: string;
		currentStatus: RsvpStatus | null;
		isLoggedIn: boolean;
		isVerified: boolean;
		redirectTo?: string;
	} = $props();

	let status = $state<RsvpStatus | null>(currentStatus);
	let loading = $state(false);

	async function handleRsvp(newStatus: RsvpStatus) {
		if (loading) return;
		loading = true;

		try {
			const res = await fetch('/api/member/rsvp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ eventId, status: newStatus })
			});

			if (res.ok) {
				status = newStatus;
			}
		} finally {
			loading = false;
		}
	}
</script>

{#if !isLoggedIn}
	<div class="rsvp-prompt">
		<a href="/register{redirectTo ? `?redirectTo=${redirectTo}` : ''}" class="rsvp-login-link">Sign in to RSVP</a>
	</div>
{:else if !isVerified}
	<div class="rsvp-prompt">
		<span class="rsvp-verify-msg">Verify your email to RSVP</span>
	</div>
{:else}
	<div class="rsvp-buttons">
		<span class="rsvp-label">RSVP</span>
		<button
			class="rsvp-btn going"
			class:active={status === 'going'}
			disabled={loading}
			onclick={() => handleRsvp('going')}
		>Going</button>
		<button
			class="rsvp-btn maybe"
			class:active={status === 'maybe'}
			disabled={loading}
			onclick={() => handleRsvp('maybe')}
		>Maybe</button>
		<button
			class="rsvp-btn not-going"
			class:active={status === 'not_going'}
			disabled={loading}
			onclick={() => handleRsvp('not_going')}
		>Not Going</button>
	</div>
{/if}

<style>
	.rsvp-prompt {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.rsvp-login-link {
		font-size: 0.85rem;
		color: #818cf8;
		text-decoration: none;
	}

	.rsvp-login-link:hover {
		text-decoration: underline;
	}

	.rsvp-verify-msg {
		font-size: 0.85rem;
		color: #6b7280;
	}

	.rsvp-buttons {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
	}

	.rsvp-label {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.4);
		margin-right: 0.25rem;
	}

	.rsvp-btn {
		padding: 0.4rem 0.9rem;
		border-radius: 9999px;
		font-size: 0.75rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.6);
	}

	.rsvp-btn:hover:not(:disabled) {
		border-color: rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.9);
	}

	.rsvp-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.rsvp-btn.going.active {
		background: rgba(34, 197, 94, 0.2);
		border-color: rgba(34, 197, 94, 0.5);
		color: #86efac;
	}

	.rsvp-btn.maybe.active {
		background: rgba(234, 179, 8, 0.2);
		border-color: rgba(234, 179, 8, 0.5);
		color: #fde047;
	}

	.rsvp-btn.not-going.active {
		background: rgba(220, 38, 38, 0.15);
		border-color: rgba(220, 38, 38, 0.4);
		color: #fca5a5;
	}
</style>
