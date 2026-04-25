<script lang="ts">
  import Accordion from '../controls/Accordion.svelte';
  import Toggle from '../controls/Toggle.svelte';
  import type { PanelState } from '../types';

  let { s, set }: { s: PanelState; set: (k: keyof PanelState, v: unknown) => void } = $props();

  let activeCount = $derived([
    s.muteSounds, s.hideImages, s.hideEmoji, s.readingGuide, s.readingMask,
    s.stopAnimations, s.highlightHover, s.highlightFocus, s.bigDarkCursor, s.bigLightCursor,
  ].filter(Boolean).length);

  function setCursor(mode: 'bigDarkCursor' | 'bigLightCursor') {
    set('bigDarkCursor', mode === 'bigDarkCursor' ? !s.bigDarkCursor : false);
    set('bigLightCursor', mode === 'bigLightCursor' ? !s.bigLightCursor : false);
  }
</script>

<Accordion title="Easy Orientation" {activeCount}>
  {#snippet icon()}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  {/snippet}
  {#snippet children()}
    <Toggle label="Mute Sounds" value={s.muteSounds} onchange={(v) => set('muteSounds', v)} />
    <Toggle label="Hide Images" value={s.hideImages} onchange={(v) => set('hideImages', v)} />
    <Toggle label="Hide Emoji" value={s.hideEmoji} onchange={(v) => set('hideEmoji', v)} />
    <Toggle label="Reading Guide" desc="A horizontal line follows your cursor"
      value={s.readingGuide} onchange={(v) => set('readingGuide', v)} />
    <Toggle label="Reading Mask" desc="Dark overlay with a clear band at cursor line"
      value={s.readingMask} onchange={(v) => set('readingMask', v)} />
    <Toggle label="Stop Animations" value={s.stopAnimations} onchange={(v) => set('stopAnimations', v)} />
    <Toggle label="Highlight Hover" value={s.highlightHover} onchange={(v) => set('highlightHover', v)} />
    <Toggle label="Highlight Focus" value={s.highlightFocus} onchange={(v) => set('highlightFocus', v)} />
    <Toggle label="Big Dark Cursor" value={s.bigDarkCursor} onchange={() => setCursor('bigDarkCursor')} />
    <Toggle label="Big Light Cursor" value={s.bigLightCursor} onchange={() => setCursor('bigLightCursor')} />
  {/snippet}
</Accordion>
