import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_STATE } from '$lib/types';
import { setConfig } from '$lib/effects/config';

function state(overrides = {}) {
  return { ...DEFAULT_STATE, ...overrides };
}

describe('overlays.sync', () => {
  beforeEach(async () => {
    const { cleanup } = await import('$lib/effects/overlays');
    cleanup();
    document.body.innerHTML = '';
    setConfig({});
  });

  it('readingGuide: creates overlay element on enable', async () => {
    const { sync, cleanup } = await import('$lib/effects/overlays');
    sync(state({ readingGuide: true }));
    expect(document.body.querySelector('[data-a11y-panel-overlay="reading-guide"]')).toBeTruthy();
    cleanup();
  });

  it('readingGuide: removes overlay element when disabled', async () => {
    const { sync, cleanup } = await import('$lib/effects/overlays');
    sync(state({ readingGuide: true }));
    sync(state({ readingGuide: false }));
    expect(document.body.querySelector('[data-a11y-panel-overlay="reading-guide"]')).toBeNull();
    cleanup();
  });

  it('readingMask: creates top and bottom overlays', async () => {
    const { sync, cleanup } = await import('$lib/effects/overlays');
    sync(state({ readingMask: true }));
    expect(document.body.querySelector('[data-a11y-panel-overlay="reading-mask-top"]')).toBeTruthy();
    expect(document.body.querySelector('[data-a11y-panel-overlay="reading-mask-bottom"]')).toBeTruthy();
    cleanup();
  });

  it('muteSounds: mutes all audio elements', async () => {
    const audio = document.createElement('audio');
    audio.muted = false;
    document.body.appendChild(audio);
    const { sync, cleanup } = await import('$lib/effects/overlays');
    sync(state({ muteSounds: true }));
    expect(audio.muted).toBe(true);
    cleanup();
  });

  it('muteSounds: restores original mute state when disabled', async () => {
    const audio = document.createElement('audio');
    audio.muted = false;
    document.body.appendChild(audio);
    const { sync, cleanup } = await import('$lib/effects/overlays');
    sync(state({ muteSounds: true }));
    sync(state({ muteSounds: false }));
    expect(audio.muted).toBe(false);
    cleanup();
  });

  it('cleanup: removes all overlay elements', async () => {
    const { sync, cleanup } = await import('$lib/effects/overlays');
    sync(state({ readingGuide: true, readingMask: true }));
    cleanup();
    expect(document.querySelectorAll('[data-a11y-panel-overlay]').length).toBe(0);
  });
});
