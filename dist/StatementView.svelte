<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getConfig } from './effects/config';

  let { onBack, customStatement }: { onBack: () => void; customStatement?: Snippet } = $props();

  const cfg = getConfig().statement;
  const safeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.email ?? '') ? cfg.email : null;
</script>

<div class="statement-view">
  <div class="statement-header">
    <button type="button" class="statement-back" onclick={onBack} aria-label="Back to accessibility settings">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M15 18l-6-6 6-6"/>
      </svg>
      Back
    </button>
    <span class="statement-title">Accessibility Statement</span>
  </div>

  <div class="statement-body">
    {#if customStatement}
      {@render customStatement()}
    {:else}
      {#if cfg.orgName}<p class="statement-org">{cfg.orgName}</p>{/if}

      <p>This website includes tools for adjusting its display, reading, and navigation settings.</p>

      {#if cfg.conformanceStatus}
        <h3>Conformance status</h3>
        <p>
          {cfg.conformanceStatus}
          See <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener">WCAG 2.1</a>.
        </p>
      {/if}

      <h3>Technical specifications</h3>
      <p>This website uses HTML, CSS, JavaScript, and WAI-ARIA.</p>

      {#if cfg.limitations && cfg.limitations.length > 0}
        <h3>Limitations</h3>
        <ul>
          {#each cfg.limitations as limitation}
            <li>{limitation}</li>
          {/each}
        </ul>
      {/if}

      {#if safeEmail}
        <h3>Feedback</h3>
        <p>Contact us at <a href="mailto:{safeEmail}">{safeEmail}</a>.</p>
      {/if}

      {#if cfg.assessmentDate}
        <h3>Assessment approach</h3>
        <p>Self-evaluation. Statement prepared {cfg.assessmentDate}.</p>
      {/if}
    {/if}
  </div>
</div>
