<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let user = $derived(data.user);
</script>

<svelte:head>
	<title>{user ? 'Admin Dashboard' : 'Admin Login'} - UICSpacetime</title>
</svelte:head>

{#if !user}
	<!-- Login Form -->
	<div class="login-container">
		<div class="login-card">
			<div class="login-header">
				<h1 class="login-title">UICSpacetime</h1>
				<p class="login-subtitle">Admin Panel</p>
			</div>

			{#if form?.error}
				<div class="error-message">
					{form.error}
				</div>
			{/if}

			<form method="POST" action="?/login" use:enhance>
				<div class="form-group">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						autocomplete="email"
						placeholder="admin@uic.edu"
					/>
				</div>

				<div class="form-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						autocomplete="current-password"
						placeholder="Enter password"
					/>
				</div>

				<button type="submit" class="submit-btn">Sign In</button>
			</form>
		</div>
	</div>
{:else}
	<!-- Dashboard -->
	<div class="dashboard">
		<h1 class="dashboard-title">Welcome, {user.name}</h1>
		<p class="dashboard-subtitle">Manage your club content from here.</p>

		<div class="dashboard-cards">
			<a href="/admin/astronomy" class="dash-card astronomy-card">
				<div class="card-icon">&#10022;</div>
				<h2>Astronomy Club</h2>
				<p>Manage events, gallery, and content for the Astronomy Club.</p>
				<span class="card-link">Go to Astronomy Admin &rarr;</span>
			</a>

			<a href="/admin/physics" class="dash-card physics-card">
				<div class="card-icon">&#9883;</div>
				<h2>Physics Club</h2>
				<p>Manage events, gallery, and content for the Physics Club.</p>
				<span class="card-link">Go to Physics Admin &rarr;</span>
			</a>
		</div>
	</div>
{/if}

<style>
	/* Login */
	.login-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		background: #f3f4f6;
	}

	.login-card {
		background: #fff;
		border-radius: 0.75rem;
		padding: 2.5rem;
		width: 100%;
		max-width: 400px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	.login-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.login-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #191923;
	}

	.login-subtitle {
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.25rem;
	}

	.error-message {
		background: #fef2f2;
		border: 1px solid #fecaca;
		color: #dc2626;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-size: 0.8rem;
		font-weight: 500;
		color: #374151;
		margin-bottom: 0.35rem;
	}

	.form-group input {
		width: 100%;
		padding: 0.6rem 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #374151;
		transition: border-color 0.15s;
	}

	.form-group input:focus {
		outline: none;
		border-color: #4f46e5;
		box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
	}

	.submit-btn {
		width: 100%;
		padding: 0.65rem;
		background: #4f46e5;
		color: #fff;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: background 0.15s;
	}

	.submit-btn:hover {
		background: #4338ca;
	}

	/* Dashboard */
	.dashboard {
		max-width: 900px;
	}

	.dashboard-title {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.75rem;
		font-weight: 700;
		color: #191923;
	}

	.dashboard-subtitle {
		font-size: 0.9rem;
		color: #6b7280;
		margin-top: 0.25rem;
		margin-bottom: 2rem;
	}

	.dashboard-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1.5rem;
	}

	.dash-card {
		background: #fff;
		border-radius: 0.75rem;
		padding: 1.75rem;
		text-decoration: none;
		border: 1px solid #e5e7eb;
		transition: box-shadow 0.2s, transform 0.2s;
	}

	.dash-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		transform: translateY(-2px);
	}

	.card-icon {
		font-size: 2rem;
		margin-bottom: 0.75rem;
	}

	.astronomy-card .card-icon {
		color: #4f46e5;
	}

	.physics-card .card-icon {
		color: #0e79b2;
	}

	.dash-card h2 {
		font-family: 'Space Grotesk', sans-serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #191923;
		margin-bottom: 0.5rem;
	}

	.dash-card p {
		font-size: 0.85rem;
		color: #6b7280;
		line-height: 1.5;
		margin-bottom: 1rem;
	}

	.card-link {
		font-size: 0.8rem;
		font-weight: 500;
		color: #4f46e5;
	}

	.physics-card .card-link {
		color: #0e79b2;
	}
</style>
