<script lang="ts">
	let { data } = $props();

	const event = data.event;

	function formatDate(dateStr: string): string {
		const d = new Date(dateStr + 'T00:00:00');
		return d.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	let qrMode = $state<'checkin' | 'rsvp'>('checkin');

	const qrData = $derived(qrMode === 'checkin' ? data.checkinUrl : data.eventUrl);
	const qrUrl = $derived(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&color=1B4332&data=${encodeURIComponent(qrData)}`);
	const qrLabel = $derived(qrMode === 'checkin' ? 'Scan to Check In' : 'RSVP & Get Reminders');
</script>

<svelte:head>
	<title>Event Poster - {event.title}</title>
</svelte:head>

<div class="poster">
	<div class="content">
		<!-- Top: Branding -->
		<div class="top-section">
			<div class="org-badge">Maynegaite Property Owners' Association</div>
		</div>

		<!-- Middle: Event Info -->
		<div class="middle-section">
			<h1 class="event-title">{event.title}</h1>

			<div class="details">
				<p class="detail">{formatDate(event.date)}</p>
				{#if event.time}
					<p class="detail">{event.time}</p>
				{/if}
				{#if event.location}
					<p class="detail">{event.location}</p>
				{/if}
			</div>

			{#if event.description}
				<p class="description">{event.description}</p>
			{/if}
		</div>

		<!-- Bottom: QR Code -->
		<div class="bottom-section">
			<div class="qr-toggle">
				<button class:active={qrMode === 'checkin'} onclick={() => (qrMode = 'checkin')}>Check-In QR</button>
				<button class:active={qrMode === 'rsvp'} onclick={() => (qrMode = 'rsvp')}>RSVP QR</button>
			</div>
			<div class="qr-wrapper">
				<img src={qrUrl} alt="QR Code" class="qr-code" />
			</div>
			<p class="qr-label">{qrLabel}</p>
			<p class="qr-url">{qrData}</p>
		</div>
	</div>
</div>

<style>
	.poster {
		width: 1080px;
		height: 1350px;
		margin: 2rem auto;
		position: relative;
		overflow: hidden;
		background: linear-gradient(180deg, #1B4332 0%, #143328 60%, #0d2418 100%);
		color: #FAF7F2;
		font-family: 'Inter', system-ui, sans-serif;
	}

	.content {
		position: relative;
		z-index: 1;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 4rem 5rem;
	}

	.top-section { text-align: center; }

	.org-badge {
		display: inline-block;
		font-size: 0.9rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		padding: 0.5rem 1.5rem;
		border: 1px solid rgba(201, 168, 76, 0.4);
		border-radius: 9999px;
		color: #C9A84C;
	}

	.middle-section {
		text-align: center;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1.5rem;
	}

	.event-title {
		font-family: 'Playfair Display', Georgia, serif;
		font-size: 4.5rem;
		font-weight: 700;
		line-height: 1.1;
		color: #FAF7F2;
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
	}

	.details { display: flex; flex-direction: column; gap: 0.5rem; }

	.detail {
		font-size: 1.4rem;
		color: #C9A84C;
		text-align: center;
	}

	.description {
		font-size: 1.1rem;
		color: rgba(250, 247, 242, 0.7);
		max-width: 600px;
		margin: 0 auto;
		line-height: 1.6;
		text-align: center;
	}

	.bottom-section {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.qr-toggle {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.qr-toggle button {
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 0.4rem 1rem;
		border-radius: 9999px;
		border: 1px solid rgba(250, 247, 242, 0.2);
		background: transparent;
		color: rgba(250, 247, 242, 0.5);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.qr-toggle button.active {
		background: rgba(201, 168, 76, 0.2);
		border-color: #C9A84C;
		color: #C9A84C;
	}

	.qr-wrapper {
		background: #FAF7F2;
		border-radius: 16px;
		padding: 1rem;
	}

	.qr-code { width: 180px; height: 180px; display: block; }

	.qr-label {
		font-size: 1rem;
		color: #C9A84C;
		letter-spacing: 0.05em;
	}

	.qr-url {
		font-size: 0.7rem;
		color: rgba(250, 247, 242, 0.3);
		word-break: break-all;
	}
</style>
