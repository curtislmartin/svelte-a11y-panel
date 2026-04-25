<script lang="ts">
  import type { PanelState } from './types';
  import { PROFILES, PROFILE_SETTINGS, DEFAULT_STATE } from './types';

  let { s, set }: { s: PanelState; set: (k: keyof PanelState, v: unknown) => void } = $props();

  let activeCount = $derived(PROFILES.filter((p) => !!s[p.id as keyof PanelState]).length);

  function toggleProfile(id: string) {
    if (s[id as keyof PanelState]) {
      set(id as keyof PanelState, false);
      const settings = PROFILE_SETTINGS[id];
      if (settings) {
        for (const k of Object.keys(settings)) {
          set(k as keyof PanelState, DEFAULT_STATE[k as keyof PanelState]);
        }
      }
    } else {
      set(id as keyof PanelState, true);
      const settings = PROFILE_SETTINGS[id];
      if (settings) {
        for (const [k, v] of Object.entries(settings)) {
          set(k as keyof PanelState, v);
        }
      }
    }
  }
</script>

<div class="profiles">
  <div class="profiles__header">
    <span>Profiles</span>
    {#if activeCount > 0}
      <span class="profiles__active-count">{activeCount} active</span>
    {/if}
  </div>
  <div class="profiles__grid">
    {#each PROFILES as p}
      {@const active = !!s[p.id as keyof PanelState]}
      {@const color = active ? '#003d26' : '#546068'}
      <button
        type="button"
        class="profile-card"
        aria-pressed={active}
        aria-label={`${p.label} profile: ${p.desc}`}
        onclick={() => toggleProfile(p.id)}
      >
        {#if active}<div class="profile-card__dot" aria-hidden="true"></div>{/if}
        <!-- Profile icon -->
        {#if p.icon === 'epilepsy'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L4 13.5h7L10 22l10-12.5h-7L13 2z"/>
          </svg>
        {:else if p.icon === 'eye'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        {:else if p.icon === 'cognitive'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2C9 2 7 4.2 7 7c0 1.8.8 3.4 2 4.5-.8.7-1.3 1.7-1.3 2.8 0 1.6 1 3 2.5 3.6-.1.3-.2.7-.2 1.1 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.4-.1-.8-.2-1.1 1.5-.6 2.5-2 2.5-3.6 0-1.1-.5-2.1-1.3-2.8 1.2-1.1 2-2.7 2-4.5C19 4.2 17 2 14 2h-2z"/>
          </svg>
        {:else if p.icon === 'adhd'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>
            <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
          </svg>
        {:else if p.icon === 'blindness'}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/>
            <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
          </svg>
        {/if}
        <span class="profile-card__label">{p.label}</span>
      </button>
    {/each}
  </div>
</div>
