<script lang="ts">
  let { onReset, onStatement }: { onReset: () => void; onStatement: () => void } = $props();
</script>

<div class="a11y-footer">
  <button type="button" class="a11y-footer__btn" onclick={onReset}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
    </svg>
    Reset
  </button>
<button type="button" class="a11y-footer__btn a11y-footer__btn--muted" onclick={onStatement}>
    Statement
  </button>
</div>
