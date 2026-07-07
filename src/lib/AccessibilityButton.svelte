<script lang="ts">
  import { openPanel, closePanel, getOpen } from './panelState.svelte';
  import { safeColor } from './effects/sanitize';

  let {
    label = 'Accessibility options',
    class: className = '',
    accentColor = '#2563eb',
  }: {
    label?: string;
    class?: string;
    accentColor?: string;
  } = $props();

  const background = $derived(safeColor(accentColor, '#2563eb'));

  let buttonEl = $state<HTMLButtonElement | null>(null);
</script>

<button
  bind:this={buttonEl}
  class={`a11y-trigger-btn ${className}`}
  type="button"
  style="background: {background};"
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
  <!-- PersonStanding — Lucide ISC licence, paths inlined to avoid adding a dependency -->
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
    <circle cx="12" cy="5" r="1"/>
    <path d="m9 20 3-6 3 6"/>
    <path d="m6 8 6 2 6-2"/>
    <path d="M12 10v4"/>
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
    outline: 3px solid #fff;
    outline-offset: 3px;
  }
</style>
