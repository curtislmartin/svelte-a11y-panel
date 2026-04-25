<script lang="ts">
  let {
    label,
    desc = '',
    display,
    ondec,
    oninc,
    atMin = false,
    atMax = false
  }: {
    label: string;
    desc?: string;
    display: string;
    ondec?: () => void;
    oninc?: () => void;
    atMin?: boolean;
    atMax?: boolean;
  } = $props();
</script>

<div class="stepper-row">
  <div class="stepper-row__content">
    <div class="stepper-row__label">{label}</div>
    {#if desc}<div class="stepper-row__desc">{desc}</div>{/if}
  </div>
  <div class="stepper-row__controls">
    <button
      type="button"
      class="stepper-btn"
      disabled={atMin}
      aria-label={`Decrease ${label}`}
      onclick={ondec}
    >−</button>
    <span class="stepper-row__display">{display}</span>
    <button
      type="button"
      class="stepper-btn"
      disabled={atMax}
      aria-label={`Increase ${label}`}
      onclick={oninc}
    >+</button>
  </div>
</div>
