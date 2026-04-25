<script lang="ts">
  import Accordion from '../controls/Accordion.svelte';
  import Toggle from '../controls/Toggle.svelte';
  import type { PanelState } from '../types';

  const RATE_STEPS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const WAVEFORM_HEIGHTS = [5,9,14,10,6,13,9,16,7,11,8,10,6,9,14,8,5,10,13,7];

  let {
    s, set, voices = [], voiceNavSupported = true
  }: {
    s: PanelState;
    set: (k: keyof PanelState, v: unknown) => void;
    voices?: SpeechSynthesisVoice[];
    voiceNavSupported?: boolean;
  } = $props();

  let rateIdx = $derived(RATE_STEPS.indexOf(s.ttsRate));
  let activeCount = $derived(
    [s.tts, s.virtualKeyboard, s.navigationKeys, s.voiceNav, s.linkNavigator].filter(Boolean).length
  );
</script>

<Accordion title="Cognitive Reading" {activeCount}>
  {#snippet icon()}
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1-1.2 2.8A4 4 0 0 1 16 12a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 1.2-2.8 4 4 0 0 1 0-5.4A4 4 0 0 1 12 2z"/>
      <line x1="12" y1="16" x2="12" y2="22"/>
    </svg>
  {/snippet}
  {#snippet children()}
    <div style="border-bottom: 1px solid var(--border)">
      <Toggle
        label="Text to Speech"
        desc={s.tts ? 'Click any text on the page to hear it read aloud' : "Uses your browser's built-in voices"}
        value={s.tts}
        onchange={(v) => set('tts', v)}
      />
      {#if s.tts}
        <div class="tts-controls">
          <div class="tts-transport">
            <button type="button" class="tts-play-btn"
              aria-label={s.ttsPlaying ? 'Pause' : 'Play'}
              onclick={() => set('ttsPlaying', !s.ttsPlaying)}
            >
              {#if s.ttsPlaying}
                <svg width="11" height="13" viewBox="0 0 11 13" fill="white">
                  <rect x="0" y="0" width="4" height="13" rx="1"/>
                  <rect x="7" y="0" width="4" height="13" rx="1"/>
                </svg>
              {:else}
                <svg width="11" height="13" viewBox="0 0 11 13" fill="white">
                  <path d="M1 1l9 5.5L1 12z"/>
                </svg>
              {/if}
            </button>
            <div class="tts-waveform" aria-hidden="true">
              {#each WAVEFORM_HEIGHTS as h, i}
                <div class="tts-waveform__bar"
                  style:height={s.ttsPlaying ? `${h}px` : '3px'}
                  style:opacity={s.ttsPlaying ? 0.55 + (i % 4) * 0.12 : 0.25}
                ></div>
              {/each}
            </div>
            <div class="tts-rate">
              <button type="button" class="tts-rate__btn" disabled={rateIdx === 0}
                aria-label="Decrease speed"
                onclick={() => rateIdx > 0 && set('ttsRate', RATE_STEPS[rateIdx-1])}
              >−</button>
              <span class="tts-rate__display">{s.ttsRate}×</span>
              <button type="button" class="tts-rate__btn" disabled={rateIdx === RATE_STEPS.length-1}
                aria-label="Increase speed"
                onclick={() => rateIdx < RATE_STEPS.length-1 && set('ttsRate', RATE_STEPS[rateIdx+1])}
              >+</button>
            </div>
          </div>
          <div class="tts-voice">
            <label class="tts-voice__label" for="tts-voice-select">Voice</label>
            <select id="tts-voice-select" class="tts-voice__select"
              value={s.ttsVoice}
              onchange={(e) => set('ttsVoice', (e.target as HTMLSelectElement).value)}
              aria-label="Select voice"
            >
              <option value="">Default system voice</option>
              {#each voices as v}
                <option value={v.name}>{v.name} ({v.lang})</option>
              {/each}
            </select>
          </div>
        </div>
      {/if}
    </div>
    <Toggle label="Virtual Keyboard" desc="Opens an on-screen keyboard overlay"
      value={s.virtualKeyboard} onchange={(v) => set('virtualKeyboard', v)} />
    <Toggle label="Navigation Keys" desc="M / H / F / B / G keyboard shortcuts"
      value={s.navigationKeys} onchange={(v) => set('navigationKeys', v)} />
    <Toggle label="Voice Navigation" desc="Speak commands to navigate the page"
      value={s.voiceNav} onchange={(v) => set('voiceNav', v)} />
    {#if s.voiceNav && !voiceNavSupported}
      <div class="voice-nav-unsupported">
        Voice navigation is not supported in this browser. Use Chrome or Edge.
      </div>
    {/if}
    <Toggle label="Link Navigator" desc="Open a searchable list of all page links"
      value={s.linkNavigator} onchange={(v) => set('linkNavigator', v)} />
  {/snippet}
</Accordion>
