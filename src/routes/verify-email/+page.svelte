<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Verify Email - UICSpacetime</title>
</svelte:head>

<div class="verify-container">
	<div class="verify-card">
		<h1 class="verify-title">UICSpacetime</h1>

		{#if data.verified}
			<div class="icon success-icon">&#10003;</div>
			<h2>Email Verified!</h2>
			<p>Your email has been verified successfully. You can now access your dashboard.</p>
			<a href="/dashboard" class="action-btn">Go to Dashboard</a>
		{:else if data.error}
			<div class="icon error-icon">&#10007;</div>
			<h2>Verification Failed</h2>
			<p>{data.error}</p>
			<a href="/login" class="action-btn">Sign In</a>
		{:else}
			<div class="icon pending-icon">&#9993;</div>
			<h2>Check Your Email</h2>
			<p>We've sent a verification link to your UIC email address. Please check your inbox and click the link to verify your account.</p>
			<p class="hint">Didn't receive it? Check your spam folder or <a href="/login">sign in</a> and request a new link.</p>
		{/if}
	</div>
</div>

<style>
	.verify-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #0a0a0f;
		padding: 2rem 1rem;
	}

	.verify-card {
		background: #191923;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 440px;
		text-align: center;
		border: 1px solid rgba(79, 70, 229, 0.2);
	}

	.verify-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 1.5rem;
	}

	.icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.success-icon { color: #22c55e; }
	.error-icon { color: #ef4444; }
	.pending-icon { color: #818cf8; }

	h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #e5e7eb;
		margin-bottom: 0.75rem;
	}

	p {
		font-size: 0.9rem;
		color: #9ca3af;
		line-height: 1.6;
		margin-bottom: 0.5rem;
	}

	.hint {
		font-size: 0.8rem;
		color: #6b7280;
		margin-top: 1rem;
	}

	.hint a {
		color: #818cf8;
		text-decoration: none;
	}

	.action-btn {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0.6rem 1.5rem;
		background: #4f46e5;
		color: #fff;
		border-radius: 0.375rem;
		text-decoration: none;
		font-size: 0.875rem;
		font-weight: 500;
		transition: background 0.15s;
	}

	.action-btn:hover {
		background: #4338ca;
	}
</style>
