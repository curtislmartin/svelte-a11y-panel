<script lang="ts">
  import Accordion from '../controls/Accordion.svelte';
  import Toggle from '../controls/Toggle.svelte';
  import Stepper from '../controls/Stepper.svelte';
  import Segment from '../controls/Segment.svelte';
  import type { PanelState } from '../types';

  const CS_STEPS = [100,110,120,130,140,150,160,170,180,190,200];
  const FS_STEPS = [12,13,14,15,16,17,18,20,22,24,28,32];
  const LH_OPTS = ['Default', 'Medium', 'Large', 'XL'];
  const LS_OPTS = ['Default', '+1px', '+2px', '+3px'];

  let { s, set }: { s: PanelState; set: (k: keyof PanelState, v: unknown) => void } = $props();

  let csIdx = $derived(CS_STEPS.indexOf(s.contentScaling));
  let fsIdx = $derived(FS_STEPS.indexOf(s.fontSize));
  let lhIdx = $derived(LH_OPTS.indexOf(s.lineHeight));
  let lsIdx = $derived(LS_OPTS.indexOf(s.letterSpacing));

  let activeCount = $derived([
    s.contentScaling !== 100, s.readableFont, s.dyslexiaFont,
    s.highlightTitles, s.highlightLinks, s.fontSize !== 16,
    s.lineHeight !== 'Default', s.letterSpacing !== 'Default',
    s.textAlign != null, s.textMagnifier,
  ].filter(Boolean).length);
</script>

<Accordion title="Readable Experience" {activeCount}>
  {#snippet icon()}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M4 7V4h16v3"/><path d="M9 20h6"/><line x1="12" y1="4" x2="12" y2="20"/>
    </svg>
  {/snippet}
  {#snippet children()}
    <Stepper label="Content Scaling" display={`${s.contentScaling}%`}
      ondec={() => csIdx > 0 && set('contentScaling', CS_STEPS[csIdx-1])}
      oninc={() => csIdx < CS_STEPS.length-1 && set('contentScaling', CS_STEPS[csIdx+1])}
      atMin={csIdx === 0} atMax={csIdx === CS_STEPS.length-1} />
    <Toggle label="Readable Font" desc="Switches to a highly legible sans-serif"
      value={s.readableFont} onchange={(v) => set('readableFont', v)} />
    <Toggle label="Dyslexia-Friendly Font" desc="Uses OpenDyslexic typeface"
      value={s.dyslexiaFont}
      onchange={(v) => { set('dyslexiaFont', v); if (v) set('readableFont', false); }} />
    <Toggle label="Highlight Titles" value={s.highlightTitles} onchange={(v) => set('highlightTitles', v)} />
    <Toggle label="Highlight Links" value={s.highlightLinks} onchange={(v) => set('highlightLinks', v)} />
    <Stepper label="Font Size" display={`${s.fontSize}px`}
      ondec={() => fsIdx > 0 && set('fontSize', FS_STEPS[fsIdx-1])}
      oninc={() => fsIdx < FS_STEPS.length-1 && set('fontSize', FS_STEPS[fsIdx+1])}
      atMin={fsIdx === 0} atMax={fsIdx === FS_STEPS.length-1} />
    <Stepper label="Line Height" display={s.lineHeight}
      ondec={() => lhIdx > 0 && set('lineHeight', LH_OPTS[lhIdx-1])}
      oninc={() => lhIdx < LH_OPTS.length-1 && set('lineHeight', LH_OPTS[lhIdx+1])}
      atMin={lhIdx === 0} atMax={lhIdx === LH_OPTS.length-1} />
    <Stepper label="Letter Spacing" display={s.letterSpacing}
      ondec={() => lsIdx > 0 && set('letterSpacing', LS_OPTS[lsIdx-1])}
      oninc={() => lsIdx < LS_OPTS.length-1 && set('letterSpacing', LS_OPTS[lsIdx+1])}
      atMin={lsIdx === 0} atMax={lsIdx === LS_OPTS.length-1} />
    <Segment label="Text Alignment" value={s.textAlign}
      opts={[{val:'left',label:'Left'},{val:'center',label:'Centre'},{val:'right',label:'Right'}]}
      onchange={(v) => set('textAlign', v)} />
    <Toggle label="Text Magnifier" desc="Hover over any text block to enlarge it"
      value={s.textMagnifier} onchange={(v) => set('textMagnifier', v)} />
  {/snippet}
</Accordion>
