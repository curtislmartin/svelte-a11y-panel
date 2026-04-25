<script lang="ts">
  import { closePanel } from './panelState.svelte';

  let {
    isMobile = false,
    onDragStart
  }: {
    isMobile?: boolean;
    onDragStart?: (e: PointerEvent) => void;
  } = $props();
</script>

<div class="a11y-header">
  {#if isMobile}
    <div class="a11y-pull" aria-hidden="true"></div>
  {:else}
    <div
      class="a11y-drag"
      aria-hidden="true"
      title="Drag to reposition"
      role="presentation"
      onpointerdown={onDragStart}
    >
      <div class="a11y-drag__row">
        <div class="a11y-drag__dot"></div>
        <div class="a11y-drag__dot"></div>
        <div class="a11y-drag__dot"></div>
      </div>
      <div class="a11y-drag__row">
        <div class="a11y-drag__dot"></div>
        <div class="a11y-drag__dot"></div>
        <div class="a11y-drag__dot"></div>
      </div>
    </div>
  {/if}

  <span class="a11y-header__title" id="a11y-panel-title">Accessibility Settings</span>

  <button
    type="button"
    class="a11y-header__close"
    aria-label="Close accessibility panel"
    onclick={closePanel}
  >✕</button>
</div>
