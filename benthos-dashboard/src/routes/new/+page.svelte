<script lang="ts">
	import { goto } from '$app/navigation';
	import CodeEditor from '$lib/components/CodeEditor.svelte';

	let streamId = $state('');
	let yamlConfig = $state(
		'input:\n  generate:\n    mapping: \'root = "hello"\'\n    interval: 1s\n    count: 10\noutput:\n  drop: {}'
	);
	let submitting = $state(false);
	let errorMsg = $state<string | null>(null);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		if (!streamId.trim()) {
			errorMsg = 'Stream ID is required';
			return;
		}

		submitting = true;
		errorMsg = null;

		try {
			const res = await fetch(`/api/streams/${streamId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/yaml'
				},
				body: yamlConfig
			});

			if (!res.ok) {
				const data = await res.json().catch(() => null);
				throw new Error(data?.message || `HTTP error! status: ${res.status}`);
			}

			// Success, redirect to home
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto('/');
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : String(err);
			errorMsg = errorMessage;
		} finally {
			submitting = false;
		}
	};
</script>

<svelte:head>
	<title>New Stream | Benthos Playground</title>
</svelte:head>

<header class="app-header" style="padding-bottom: 1rem;">
	<div class="logo-container">
		<div class="glow-orb"></div>
		<h1 id="main-title">Add New Stream</h1>
	</div>
</header>

<main class="dashboard-main form-container">
	<!-- svelte-ignore svelte/no-navigation-without-resolve -->
	<a href="/" class="back-link">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"
			></polyline></svg
		>
		Back to Dashboard
	</a>

	<form class="stream-form stream-card" onsubmit={handleSubmit}>
		{#if errorMsg}
			<div class="form-error">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line
						x1="12"
						y1="16"
						x2="12.01"
						y2="16"
					></line></svg
				>
				{errorMsg}
			</div>
		{/if}

		<div class="form-group">
			<label for="streamId">Stream ID</label>
			<input
				type="text"
				id="streamId"
				bind:value={streamId}
				placeholder="e.g., my_custom_pipeline"
				required
				class="premium-input"
			/>
		</div>

		<div class="form-group">
			<label for="yamlConfig">YAML Configuration</label>
			<CodeEditor bind:value={yamlConfig} id="yamlConfig" />
		</div>

		<button type="submit" class="submit-btn" disabled={submitting}>
			{submitting ? 'Creating...' : 'Create Stream'}
		</button>
	</form>
</main>

<style>
	.form-container {
		max-width: 800px;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-secondary);
		text-decoration: none;
		margin-bottom: 2rem;
		font-weight: 500;
		transition: color 0.2s;
	}
	.back-link:hover {
		color: var(--text-primary);
	}

	.stream-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	label {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.premium-input {
		background: rgba(15, 23, 42, 0.5);
		border: 1px solid var(--card-border);
		border-radius: 8px;
		color: var(--text-primary);
		padding: 0.75rem 1rem;
		font-family: 'Outfit', sans-serif;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.premium-input:focus {
		outline: none;
		border-color: var(--accent-primary);
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
	}

	.submit-btn {
		margin-top: 1rem;
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		color: white;
		border: none;
		padding: 1rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			opacity 0.2s,
			transform 0.1s;
		box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
	}

	.submit-btn:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.submit-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.form-error {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: var(--error-color);
		padding: 1rem;
		border-radius: 8px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-weight: 500;
	}
</style>
