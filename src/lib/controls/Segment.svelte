<script lang="ts">
  let {
    label,
    value,
    opts,
    onchange
  }: {
    label: string;
    value: string | null;
    opts: { val: string; label: string }[];
    onchange?: (v: string | null) => void;
  } = $props();
</script>

<div class="segment-row">
  <div class="segment-row__label">{label}</div>
  <div class="segment-group" role="group" aria-label={label}>
    {#each opts as o}
      <button
        type="button"
        class="segment-btn"
        aria-pressed={value === o.val}
        onclick={() => onchange?.(value === o.val ? null : o.val)}
      >{o.label}</button>
    {/each}
  </div>
</div>
