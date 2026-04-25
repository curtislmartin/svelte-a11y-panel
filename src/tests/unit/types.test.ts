import { describe, it, expect } from 'vitest';
import { DEFAULT_STATE, PROFILES, PROFILE_SETTINGS } from '$lib/types';

describe('types', () => {
  it('every PROFILE has a matching PROFILE_SETTINGS entry', () => {
    for (const p of PROFILES) {
      expect(PROFILE_SETTINGS).toHaveProperty(p.id);
    }
  });

  it('PROFILE_SETTINGS keys are all valid PanelState keys', () => {
    for (const [, settings] of Object.entries(PROFILE_SETTINGS)) {
      for (const key of Object.keys(settings)) {
        expect(DEFAULT_STATE).toHaveProperty(key);
      }
    }
  });

  it('DEFAULT_STATE has expected structure', () => {
    expect(DEFAULT_STATE.contentScaling).toBe(100);
    expect(DEFAULT_STATE.tts).toBe(false);
    expect(DEFAULT_STATE.fontSize).toBe(16);
  });
});
