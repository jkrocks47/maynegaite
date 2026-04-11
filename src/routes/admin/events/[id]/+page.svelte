<script lang="ts">
	import EventDetailPanel from '$lib/components/admin/EventDetailPanel.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.event.title} - Events - Maynegaite Admin</title>
</svelte:head>

<EventDetailPanel
	event={data.event}
	rsvpList={data.rsvpList}
	stats={data.stats}
	historicalRate={data.historicalRate}
	backHref="/admin/events"
	announcementRecipientCount={data.announcementRecipientCount}
	announcementAlreadySent={data.announcementAlreadySent}
	checkinQuestions={data.checkinQuestions}
	checkinResponses={data.checkinResponses}
/>
