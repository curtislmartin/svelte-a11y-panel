<script lang="ts">
  import { openPanel, closePanel, getOpen } from './panelState.svelte';

  let {
    label = 'Accessibility options',
    class: className = '',
  }: {
    label?: string;
    class?: string;
  } = $props();

  let buttonEl = $state<HTMLButtonElement | null>(null);
</script>

<button
  bind:this={buttonEl}
  class={`a11y-trigger-btn ${className}`}
  type="button"
  onclick={() => {
    if (getOpen()) {
      closePanel();
    } else if (buttonEl) {
      openPanel(buttonEl);
    }
  }}
  aria-label={label}
  aria-expanded={getOpen()}
  aria-controls="a11y-panel"
>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="1.5"/>
    <path d="M9 9l-2 7h10l-2-7"/>
    <path d="M7 16l1 5M17 16l-1 5"/>
    <path d="M9 9h6"/>
  </svg>
  <slot>Accessibility</slot>
</button>

<style>
  .a11y-trigger-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border: none;
    background: none;
    padding: 8px;
    border-radius: 4px;
    font: inherit;
    color: inherit;
  }
</style>
