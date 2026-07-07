<script lang="ts">
	import Prism from 'prismjs';
	import 'prismjs/components/prism-yaml';
	import 'prismjs/themes/prism-tomorrow.css'; // A beautiful dark theme

	let { value = $bindable(''), id = 'code-editor' } = $props<{ value: string; id?: string }>();
	let textareaRef: HTMLTextAreaElement;
	let preRef: HTMLPreElement;

	const handleScroll = () => {
		if (preRef && textareaRef) {
			preRef.scrollTop = textareaRef.scrollTop;
			preRef.scrollLeft = textareaRef.scrollLeft;
		}
	};
</script>

<div class="editor-container">
	<!-- svelte-ignore svelte/no-at-html-tags -->
	<pre class="syntax-overlay" bind:this={preRef} aria-hidden="true"><code class="language-yaml"
			>{@html Prism.highlight(value, Prism.languages.yaml, 'yaml')}</code
		><br /></pre>
	<textarea
		{id}
		bind:value
		bind:this={textareaRef}
		class="code-textarea"
		spellcheck="false"
		onscroll={handleScroll}></textarea>
</div>

<style>
	.editor-container {
		position: relative;
		width: 100%;
		height: 400px; /* Fixed height for scrollable region */
		background: #2d2d2d; /* prism-tomorrow background */
		border-radius: 8px;
		border: 1px solid var(--card-border, #444);
		overflow: hidden;
	}

	.syntax-overlay,
	.code-textarea {
		margin: 0 !important;
		border: 0;
		padding: 1rem;
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		box-sizing: border-box;
		font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
		white-space: pre;
		overflow-wrap: normal;
		overflow: auto;
		tab-size: 2;
	}

	.syntax-overlay {
		pointer-events: none;
		z-index: 1;
		background: transparent !important; /* override prism theme */
	}

	.syntax-overlay code {
		font-family: inherit;
		font-size: inherit;
		line-height: inherit;
		text-shadow: none; /* remove prism shadow if any */
	}

	.code-textarea {
		z-index: 2;
		color: transparent;
		background: transparent;
		caret-color: #f8fafc;
		resize: none;
		outline: none;
	}

	.code-textarea::selection {
		background: rgba(59, 130, 246, 0.3);
		color: transparent;
	}

	.code-textarea:focus {
		box-shadow: inset 0 0 0 1px var(--accent-primary, #3b82f6);
	}
</style>
