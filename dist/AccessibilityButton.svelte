<script lang="ts">
  import { openPanel, closePanel, getOpen } from './panelState.svelte';

  let {
    label = 'Accessibility options',
    class: className = '',
    accentColor = '#2563eb',
  }: {
    label?: string;
    class?: string;
    accentColor?: string;
  } = $props();

  let buttonEl = $state<HTMLButtonElement | null>(null);
</script>

<button
  bind:this={buttonEl}
  class={`a11y-trigger-btn ${className}`}
  type="button"
  style="background: {accentColor};"
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
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5" r="2"/>
    <path d="m6 20 6-6 6 6"/>
    <path d="m6 14 4-2-4-2v4"/>
    <path d="m18 14-4-2 4-2v4"/>
  </svg>
</button>

<style>
  .a11y-trigger-btn {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    z-index: 9998;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    padding: 0;
  }
  .a11y-trigger-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  .a11y-trigger-btn:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 3px;
  }
</style>
