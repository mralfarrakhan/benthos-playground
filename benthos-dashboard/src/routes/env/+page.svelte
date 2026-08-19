<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Environment Variables | Benthos Playground</title>
</svelte:head>

<header class="app-header">
	<div class="logo-container">
		<a href="/" class="back-link" aria-label="Go back">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
		</a>
		<h1 id="main-title">Environment Variables</h1>
	</div>
	<p class="subtitle">Variables defined in the root .env file</p>
</header>

<main class="dashboard-main">
	{#if data.error}
		<div class="error-state">
			<p>{data.error}</p>
		</div>
	{:else}
		<div class="stream-card">
			<div class="card-header">
				<h2 class="stream-title">Defined Variables</h2>
			</div>
			<div class="card-content">
				{#if data.envVars.length === 0}
					<p class="empty-state">No variables defined yet. Add them to the .env file.</p>
				{:else}
					<table class="env-table">
						<thead>
							<tr>
								<th>Key</th>
								<th>Value</th>
							</tr>
						</thead>
						<tbody>
							{#each data.envVars as { key, value }}
								<tr>
									<td class="key-cell"><code>{key}</code></td>
									<td class="value-cell"><code>{value}</code></td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</div>

		<div class="stream-card" style="margin-top: 2rem;">
			<div class="card-header">
				<h2 class="stream-title">Raw Content</h2>
			</div>
			<div class="card-content">
				<pre class="raw-env"><code>{data.raw}</code></pre>
			</div>
		</div>
	{/if}
</main>

<style>
	.back-link {
		color: var(--text-muted);
		margin-right: 1rem;
		display: flex;
		align-items: center;
		transition: color 0.2s ease;
	}
	.back-link:hover {
		color: var(--text-glow);
	}
	
	.env-table {
		width: 100%;
		border-collapse: collapse;
		text-align: left;
	}
	
	.env-table th {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color);
		color: var(--text-muted);
		font-weight: 500;
	}
	
	.env-table td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color);
	}
	
	.env-table tr:last-child td {
		border-bottom: none;
	}
	
	.key-cell code {
		color: var(--accent-color);
		font-weight: 600;
	}
	
	.empty-state {
		color: var(--text-muted);
		font-style: italic;
	}
	
	.raw-env {
		background-color: var(--bg-darker);
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		color: var(--text-color);
		margin: 0;
	}
</style>
