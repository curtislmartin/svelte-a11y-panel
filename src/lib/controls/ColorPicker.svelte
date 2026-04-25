<script lang="ts">
  let {
    label,
    value,
    onchange
  }: {
    label: string;
    value: string;
    onchange?: (v: string) => void;
  } = $props();
</script>

<div class="color-row">
  <div class="color-row__label">{label}</div>
  <div class="color-row__controls">
    <div class="color-swatch" style:background={value}>
      <input
        type="color"
        {value}
        oninput={(e) => onchange?.((e.target as HTMLInputElement).value)}
        aria-label={`Pick colour for ${label}`}
      />
    </div>
    <code class="color-hex">{value}</code>
  </div>
</div>
