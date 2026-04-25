<script lang="ts">
  import { untrack } from 'svelte';
  import type { Snippet } from 'svelte';

  let {
    title,
    activeCount = 0,
    startOpen = false,
    icon,
    children
  }: {
    title: string;
    activeCount?: number;
    startOpen?: boolean;
    icon: Snippet;
    children: Snippet;
  } = $props();

  // startOpen is a seed value only — read it once without tracking.
  let open = $state(untrack(() => startOpen));
</script>

<div class="accordion__body">
  <button
    type="button"
    class="accordion__trigger"
    aria-expanded={open}
    onclick={() => (open = !open)}
  >
    <span class="accordion__icon">{@render icon()}</span>
    <span class="accordion__title">{title}</span>
    {#if activeCount > 0}
      <span class="accordion__badge">{activeCount}</span>
    {/if}
    <span class="accordion__chevron" aria-hidden="true">▾</span>
  </button>
  {#if open}
    <div>{@render children()}</div>
  {/if}
</div>
