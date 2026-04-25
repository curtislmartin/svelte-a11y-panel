<script lang="ts">
  let {
    label,
    desc = '',
    value = false,
    onchange
  }: {
    label: string;
    desc?: string;
    value?: boolean;
    onchange?: (v: boolean) => void;
  } = $props();
</script>

<label class="toggle-row" class:toggle-row--active={value}>
  <div class="toggle-row__content">
    <div class="toggle-row__label">{label}</div>
    {#if desc}<div class="toggle-row__desc">{desc}</div>{/if}
  </div>
  <button
    type="button"
    role="switch"
    aria-checked={value}
    class="toggle-pill"
    class:toggle-pill--on={value}
    aria-label={label}
    onclick={() => onchange?.(!value)}
    onkeydown={(e) => (e.key === ' ' || e.key === 'Enter') && onchange?.(!value)}
  >
    <div class="toggle-pill__thumb"></div>
  </button>
</label>
