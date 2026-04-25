<script lang="ts">
  import Accordion from '../controls/Accordion.svelte';
  import Toggle from '../controls/Toggle.svelte';
  import ColorPicker from '../controls/ColorPicker.svelte';
  import type { PanelState } from '../types';

  let { s, set }: { s: PanelState; set: (k: keyof PanelState, v: unknown) => void } = $props();

  const CONTRAST_MODES = ['darkContrast', 'lightContrast', 'monochrome', 'highContrast'] as const;

  function setContrast(mode: string) {
    CONTRAST_MODES.forEach((k) => set(k, k === mode ? !Boolean(s[k]) : false));
  }

  let activeCount = $derived([
    s.darkContrast, s.lightContrast, s.monochrome, s.highContrast,
    s.highSaturation, s.lowSaturation,
    s.textColor !== '#3d4550', s.titleColor !== '#003d26', s.bgColor !== '#FAFCFA',
  ].filter(Boolean).length);
</script>

<Accordion title="Visually Pleasing" {activeCount}>
  {#snippet icon()}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="3"/><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
    </svg>
  {/snippet}
  {#snippet children()}
    <div class="contrast-section">
      <div class="contrast-section__label">
        Contrast Mode <span style="font-weight:400">(select one)</span>
      </div>
      <div class="contrast-grid">
        {#each [
          { id: 'darkContrast',  label: 'Dark Contrast' },
          { id: 'lightContrast', label: 'Light Contrast' },
          { id: 'monochrome',    label: 'Monochrome' },
          { id: 'highContrast',  label: 'High Contrast' },
        ] as item}
          <button type="button" class="contrast-chip"
            aria-pressed={!!s[item.id as keyof PanelState]}
            onclick={() => setContrast(item.id)}
          >{item.label}</button>
        {/each}
      </div>
    </div>
    <Toggle label="High Saturation" value={s.highSaturation}
      onchange={(v) => { set('highSaturation', v); if (v) set('lowSaturation', false); }} />
    <Toggle label="Low Saturation" value={s.lowSaturation}
      onchange={(v) => { set('lowSaturation', v); if (v) set('highSaturation', false); }} />
    <ColorPicker label="Text Colour" value={s.textColor} onchange={(v) => set('textColor', v)} />
    <ColorPicker label="Title Colour" value={s.titleColor} onchange={(v) => set('titleColor', v)} />
    <ColorPicker label="Background Colour" value={s.bgColor} onchange={(v) => set('bgColor', v)} />
  {/snippet}
</Accordion>
