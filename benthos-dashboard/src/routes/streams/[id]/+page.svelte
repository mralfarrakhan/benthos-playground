<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';

	let streamId = $derived($page.params.id);
	let yamlConfig = $state('');
	let loading = $state(true);
	let submitting = $state(false);
	let errorMsg = $state<string | null>(null);

	onMount(async () => {
		try {
			const res = await fetch(`/api/streams/${streamId}`);
			if (!res.ok) throw new Error(await res.text());
			const data = await res.json();
			yamlConfig = data.config;
		} catch (err: any) {
			errorMsg = err.message || 'Failed to load configuration.';
		} finally {
			loading = false;
		}
	});

	const handleUpdate = async () => {
		submitting = true;
		errorMsg = null;

		try {
			const res = await fetch(`/api/streams/${streamId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/yaml' },
				body: yamlConfig
			});

			if (!res.ok) throw new Error(await res.text());
			// Show temporary success or just navigate
			goto('/');
		} catch (err: any) {
			errorMsg = err.message || String(err);
		} finally {
			submitting = false;
		}
	};

	const handleDelete = async () => {
		if (!confirm(`Are you sure you want to delete the stream "${streamId}"?`)) return;
		
		submitting = true;
		errorMsg = null;

		try {
			const res = await fetch(`/api/streams/${streamId}`, {
				method: 'DELETE'
			});

			if (!res.ok) throw new Error(await res.text());
			goto('/');
		} catch (err: any) {
			errorMsg = err.message || String(err);
			submitting = false;
		}
	};
</script>

<svelte:head>
	<title>{streamId} | Benthos Playground</title>
</svelte:head>

<header class="app-header" style="padding-bottom: 1rem;">
	<div class="logo-container">
		<div class="glow-orb"></div>
		<h1 id="main-title">Stream Details</h1>
	</div>
	<p class="subtitle">{streamId}</p>
</header>

<main class="dashboard-main form-container">
	<a href="/" class="back-link">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
		Back to Dashboard
	</a>

	{#if loading}
		<div class="stream-card loading-container">
			<div class="spinner"></div>
			<p>Loading configuration...</p>
		</div>
	{:else}
		<div class="stream-card stream-form">
			{#if errorMsg}
				<div class="form-error">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
					{errorMsg}
				</div>
			{/if}

			<div class="form-group">
				<label for="yamlConfig">YAML Configuration</label>
				<CodeEditor bind:value={yamlConfig} id="yamlConfig" />
			</div>

			<div class="button-group">
				<button type="button" class="submit-btn" onclick={handleUpdate} disabled={submitting}>
					{submitting ? 'Working...' : 'Save Changes'}
				</button>
				<button type="button" class="delete-btn" onclick={handleDelete} disabled={submitting}>
					Delete Stream
				</button>
			</div>
		</div>
	{/if}
</main>

<style>
	.form-container {
		max-width: 800px;
	}
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--text-secondary);
	}
	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		border-top-color: var(--accent-primary);
		animation: spin 1s ease-in-out infinite;
		margin-bottom: 1rem;
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

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 0.5rem;
	}

	.submit-btn, .delete-btn {
		flex: 1;
		color: white;
		border: none;
		padding: 1rem;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.2s, transform 0.1s;
	}

	.submit-btn {
		background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
		box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
	}

	.delete-btn {
		background: linear-gradient(135deg, #ef4444, #dc2626);
		box-shadow: 0 4px 14px rgba(239, 68, 68, 0.4);
	}

	.submit-btn:hover:not(:disabled), .delete-btn:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.submit-btn:disabled, .delete-btn:disabled {
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
