<script lang="ts">
  import { focusTrap } from './focusTrap';
  import { closePanel, getOpen } from './panelState.svelte';
  import { useDrag } from './useDrag.svelte';
  import PanelHeader from './PanelHeader.svelte';
  import PanelFooter from './PanelFooter.svelte';
  import ProfilesSection from './ProfilesSection.svelte';
  import ReadableSection from './sections/ReadableSection.svelte';
  import VisualSection from './sections/VisualSection.svelte';
  import OrientationSection from './sections/OrientationSection.svelte';
  import CognitiveSection from './sections/CognitiveSection.svelte';
  import StatementView from './StatementView.svelte';
  import type { Snippet } from 'svelte';
  import { DEFAULT_STATE, type PanelState } from './types';
  import * as hostStyles from './effects/hostStyles';
  import * as overlays from './effects/overlays';
  import * as persist from './effects/persist';
  import * as tts from './effects/tts';
  import * as voiceNav from './effects/voiceNav';
  import * as navKeys from './effects/navKeys';
  import * as linkNav from './effects/linkNav';
  import * as vkb from './effects/virtualKeyboard';

  let { initialState = DEFAULT_STATE, customStatement }: { initialState?: PanelState; customStatement?: Snippet } = $props();

  let s = $state<PanelState>({ ...initialState });
  let view = $state<'main' | 'statement'>('main');
  let isMobile = $state(false);
  let panelEl = $state<HTMLElement | null>(null);
  let availableVoices = $state<SpeechSynthesisVoice[]>([]);
  let voiceNavSupported = $state(false);
  const { init: initDrag, startDrag } = useDrag(() => panelEl);

  function set(key: keyof PanelState, val: unknown) {
    (s as unknown as Record<string, unknown>)[key] = val;
  }

  function reset() {
    s = { ...DEFAULT_STATE };
    overlays.cleanup();
    tts.stopTTS();
    voiceNav.stop();
    navKeys.stop();
    linkNav.close();
    vkb.hide();
  }

  // CSS host effects + persistence + GSAP pause
  $effect(() => {
    const snap = { ...s };
    hostStyles.apply(snap);
    overlays.sync(snap);
    persist.save(snap);
    const gsap = (window as any).gsap;
    if (gsap) {
      if (snap.stopAnimations) gsap.globalTimeline.pause();
      else gsap.globalTimeline.resume();
    }
  });

  // TTS: restart whenever tts is on and rate/voice changes
  $effect(() => {
    if (!s.tts) { tts.stopTTS(); return; }
    tts.startTTS({ rate: s.ttsRate, voice: s.ttsVoice });
    tts.loadVoices().then(v => { availableVoices = v; });
    return () => tts.stopTTS();
  });

  $effect(() => { if (s.tts) tts.setPlaying(s.ttsPlaying); });

  // Voice Nav
  $effect(() => {
    voiceNavSupported = voiceNav.isSupported();
    if (!s.voiceNav) { voiceNav.stop(); return; }
    voiceNav.start();
    return () => voiceNav.stop();
  });

  // Navigation Keys
  $effect(() => {
    if (!s.navigationKeys) { navKeys.stop(); return; }
    navKeys.start();
    return () => navKeys.stop();
  });

  // Link Navigator
  $effect(() => {
    if (!s.linkNavigator) { linkNav.close(); return; }
    linkNav.open(() => set('linkNavigator', false));
  });

  // Virtual Keyboard
  $effect(() => {
    if (!s.virtualKeyboard) { vkb.hide(); return; }
    vkb.show();
    const onClose = () => set('virtualKeyboard', false);
    document.addEventListener('a11y-panel-vkb-close', onClose);
    return () => { vkb.hide(); document.removeEventListener('a11y-panel-vkb-close', onClose); };
  });

  $effect(() => { if (!isMobile && panelEl) initDrag(); });

  $effect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    isMobile = mq.matches;
    const handler = (e: MediaQueryListEvent) => { isMobile = e.matches; };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  });

  $effect(() => {
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && getOpen()) closePanel();
    }
    window.addEventListener('keydown', onKeydown);
    return () => window.removeEventListener('keydown', onKeydown);
  });

  $effect(() => {
    if (isMobile && panelEl) {
      panelEl.style.left = '';
      panelEl.style.top = '';
      panelEl.style.right = '';
      panelEl.style.bottom = '';
    }
  });
</script>

<div
  id="a11y-panel"
  class="a11y-panel"
  aria-hidden={!getOpen() ? 'true' : 'false'}
  role="dialog"
  aria-modal="true"
  aria-labelledby="a11y-panel-title"
  bind:this={panelEl}
  use:focusTrap
>
  <PanelHeader {isMobile} onDragStart={isMobile ? undefined : startDrag} />
  {#if view === 'statement'}
    <StatementView onBack={() => { view = 'main'; }} {customStatement} />
  {:else}
    <div class="a11y-body" tabindex="-1">
      <ProfilesSection {s} {set} />
      <ReadableSection {s} {set} />
      <VisualSection {s} {set} />
      <OrientationSection {s} {set} />
      <CognitiveSection {s} {set} voices={availableVoices} {voiceNavSupported} />
    </div>
    <PanelFooter onReset={reset} onStatement={() => { view = 'statement'; }} />
  {/if}
</div>
