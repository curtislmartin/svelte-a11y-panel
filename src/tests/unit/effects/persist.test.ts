import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setConfig } from '$lib/effects/config';

// Provide a full localStorage mock since the jsdom environment may stub it incompletely
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true });

describe('persist', () => {
  beforeEach(() => {
    localStorageMock.clear();
    setConfig({});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('save writes state to localStorage under default key after debounce', async () => {
    const { save } = await import('$lib/effects/persist');
    const { DEFAULT_STATE } = await import('$lib/types');
    save({ ...DEFAULT_STATE, tts: true });
    vi.runAllTimers();
    const raw = localStorage.getItem('a11y-panel-state');
    expect(raw).toBeTruthy();
    expect(JSON.parse(raw!).tts).toBe(true);
  });

  it('load returns DEFAULT_STATE when nothing saved', async () => {
    const { load } = await import('$lib/effects/persist');
    const { DEFAULT_STATE } = await import('$lib/types');
    const state = load();
    expect(state).toEqual(DEFAULT_STATE);
  });

  it('load merges partial saved state with DEFAULT_STATE', async () => {
    const { DEFAULT_STATE } = await import('$lib/types');
    localStorage.setItem('a11y-panel-state', JSON.stringify({ tts: true }));
    const { load } = await import('$lib/effects/persist');
    const state = load();
    expect(state.tts).toBe(true);
    expect(state.fontSize).toBe(DEFAULT_STATE.fontSize);
  });

  it('clear removes the key', async () => {
    localStorage.setItem('a11y-panel-state', '{}');
    const { clear } = await import('$lib/effects/persist');
    clear();
    expect(localStorage.getItem('a11y-panel-state')).toBeNull();
  });
});
