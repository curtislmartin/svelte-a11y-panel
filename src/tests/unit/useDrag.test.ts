import { describe, it, expect, beforeEach } from 'vitest';
import { setConfig } from '$lib/effects/config';
import { useDrag } from '$lib/useDrag.svelte';

const POS_KEY = 'a11y-panel-pos';

describe('useDrag saved position validation', () => {
  let panel: HTMLElement;

  beforeEach(() => {
    setConfig({});
    sessionStorage.clear();
    panel = document.createElement('div');
    document.body.appendChild(panel);
  });

  function initWithSaved(raw: string) {
    sessionStorage.setItem(POS_KEY, raw);
    const { init } = useDrag(() => panel);
    init();
  }

  it('applies a valid saved position as-is', () => {
    initWithSaved(JSON.stringify({ x: 120, y: 90 }));
    expect(panel.style.left).toBe('120px');
    expect(panel.style.top).toBe('90px');
  });

  it('clamps an offscreen saved position back into the viewport', () => {
    initWithSaved(JSON.stringify({ x: -99999, y: -99999 }));
    expect(parseFloat(panel.style.left)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(panel.style.top)).toBeGreaterThanOrEqual(0);

    initWithSaved(JSON.stringify({ x: 99999, y: 99999 }));
    expect(parseFloat(panel.style.left)).toBeLessThanOrEqual(window.innerWidth);
    expect(parseFloat(panel.style.top)).toBeLessThanOrEqual(window.innerHeight);
  });

  it('ignores saved positions with non-numeric coordinates', () => {
    initWithSaved(JSON.stringify({ x: '50px; position: absolute', y: null }));
    const left = parseFloat(panel.style.left);
    const top = parseFloat(panel.style.top);
    expect(Number.isFinite(left)).toBe(true);
    expect(Number.isFinite(top)).toBe(true);
    expect(left).toBeGreaterThanOrEqual(0);
    expect(top).toBeGreaterThanOrEqual(0);
  });

  it('falls back to the default position when saved JSON is garbage', () => {
    initWithSaved('not json');
    expect(Number.isFinite(parseFloat(panel.style.left))).toBe(true);
    expect(Number.isFinite(parseFloat(panel.style.top))).toBe(true);
  });
});
