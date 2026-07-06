<script lang="ts">
	import type { StreamInfo } from '$lib/assets/types';
	import { onMount } from 'svelte';

	let benthosStreams = $state<Record<string, StreamInfo>>();

	const getStreams = () =>
		fetch('/api/streams')
			.then((v) => v.json())
			.catch((r) => ({ error: String(r) }));

	onMount(async () => {
		benthosStreams = await getStreams();
	});
</script>

<h1>Benthos Playground</h1>

<main>
	<div>
		<h1>Streams</h1>
		{#if benthosStreams}
			{#each Object.entries(benthosStreams).toSorted(([, a], [, b]) => b.uptime - a.uptime) as [k, v] (k)}
				<div>
					{k} - {v.uptime.toFixed(2)}
				</div>
			{/each}
		{/if}
	</div>
	<div></div>
</main>
