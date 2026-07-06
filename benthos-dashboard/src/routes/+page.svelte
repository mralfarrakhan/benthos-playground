<script lang="ts">
	import type { StreamInfo } from '$lib/assets/types';
	import { onMount } from 'svelte';

	let benthosStreams = $state<Record<string, StreamInfo>>();
	let loading = $state(true);
	let error = $state<string | null>(null);

	const getStreams = () =>
		fetch('/api/streams')
			.then((v) => {
				if (!v.ok) throw new Error(`HTTP error! status: ${v.status}`);
				return v.json();
			})
			.catch((err) => {
				error = err.message || String(err);
				return null;
			});

	onMount(async () => {
		benthosStreams = await getStreams();
		loading = false;
	});
</script>

<svelte:head>
	<title>Dashboard | Benthos Playground</title>
	<meta name="description" content="A monitoring dashboard for local Benthos streams." />
</svelte:head>

<header class="app-header">
	<div class="logo-container">
		<div class="glow-orb"></div>
		<h1 id="main-title">Benthos Streams</h1>
	</div>
	<p class="subtitle">Real-time pipeline monitoring and observability</p>
	<div class="header-actions">
		<a href="/new" class="add-btn">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
			Add Stream
		</a>
	</div>
</header>

<style>
	.header-actions {
		margin-top: 1.5rem;
		display: flex;
		justify-content: center;
	}

	.add-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid var(--card-border);
		color: var(--text-primary);
		padding: 0.75rem 1.5rem;
		border-radius: 9999px;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s;
	}
	
	.add-btn:hover {
		background: rgba(255, 255, 255, 0.2);
		border-color: var(--card-hover-border);
		transform: translateY(-1px);
	}
</style>

<main class="dashboard-main">
	{#if loading}
		<div class="loading-state">
			<div class="spinner"></div>
			<p>Connecting to Benthos...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
			<p>Failed to load streams: {error}</p>
		</div>
	{:else if benthosStreams}
		<div class="streams-grid">
			{#each Object.entries(benthosStreams).toSorted(([, a], [, b]) => b.uptime - a.uptime) as [id, info] (id)}
				<article class="stream-card" id="stream-{id}">
					<div class="card-header">
						<h2 class="stream-title">{id}</h2>
						<div class="status-indicator" class:active={info.active}>
							<span class="pulse-dot"></span>
							{info.active ? 'Active' : 'Inactive'}
						</div>
					</div>
					<div class="card-body">
						<div class="metric">
							<span class="metric-label">Uptime</span>
							<span class="metric-value">{info.uptime_str || `${info.uptime.toFixed(2)}s`}</span>
						</div>
						<div class="metric">
							<span class="metric-label">Status</span>
							<span class="metric-value status-text">{info.active ? 'Running smoothly' : 'Stopped'}</span>
						</div>
					</div>
					<div class="card-footer">
						<button class="action-btn" aria-label="View details for {id}">View Details</button>
					</div>
				</article>
			{/each}
		</div>
		{#if Object.keys(benthosStreams).length === 0}
			<div class="empty-state">
				<p>No streams found. Check your Benthos configuration in the streams/ directory.</p>
			</div>
		{/if}
	{/if}
</main>
