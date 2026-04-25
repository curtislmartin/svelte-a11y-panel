import { describe, it, expect, beforeEach } from 'vitest';
import { buildCSS } from '$lib/effects/hostStyles';
import { DEFAULT_STATE } from '$lib/types';
import { setConfig } from '$lib/effects/config';

function state(overrides = {}) {
  return { ...DEFAULT_STATE, ...overrides };
}

describe('buildCSS', () => {
  beforeEach(() => setConfig({}));

  it('returns empty string for DEFAULT_STATE', () => {
    expect(buildCSS(DEFAULT_STATE)).toBe('');
  });

  it('adds zoom rule when contentScaling is not 100', () => {
    expect(buildCSS(state({ contentScaling: 120 }))).toContain('zoom: 120%');
  });

  it('adds dyslexia font-face and applies it', () => {
    const css = buildCSS(state({ dyslexiaFont: true }));
    expect(css).toContain("font-family: 'OpenDyslexic'");
    expect(css).toContain('@font-face');
  });

  it('dyslexia font-face uses configured dyslexiaFontUrl', () => {
    setConfig({ dyslexiaFontUrl: 'https://example.com/font.woff2' });
    const css = buildCSS(state({ dyslexiaFont: true }));
    expect(css).toContain('https://example.com/font.woff2');
  });

  it('readable font uses Arial', () => {
    expect(buildCSS(state({ readableFont: true }))).toContain('Arial');
  });

  it('dark contrast adds invert filter', () => {
    const css = buildCSS(state({ darkContrast: true }));
    expect(css).toContain('invert(1)');
    expect(css).toContain('hue-rotate(180deg)');
  });

  it('dark contrast re-inverts images', () => {
    expect(buildCSS(state({ darkContrast: true }))).toContain('img, video, canvas');
  });

  it('monochrome adds grayscale filter', () => {
    expect(buildCSS(state({ monochrome: true }))).toContain('grayscale(1)');
  });

  it('highSaturation and darkContrast stack in one filter rule', () => {
    const css = buildCSS(state({ darkContrast: true, highSaturation: true }));
    const filterLines = css.split('\n').filter(l => l.includes('html { filter:'));
    expect(filterLines.length).toBe(1);
    expect(filterLines[0]).toContain('invert(1)');
    expect(filterLines[0]).toContain('saturate(2.5)');
  });

  it('stopAnimations kills durations', () => {
    const css = buildCSS(state({ stopAnimations: true }));
    expect(css).toContain('animation-duration: 0.001ms');
    expect(css).toContain('transition-duration: 0.001ms');
  });

  it('highlightTitles adds background to h1-h6', () => {
    const css = buildCSS(state({ highlightTitles: true }));
    expect(css).toContain('h1, h2, h3, h4, h5, h6');
    expect(css).toContain('#fffbcc');
  });

  it('uses configured accentColor for focus highlights', () => {
    setConfig({ accentColor: '#ff0000' });
    const css = buildCSS(state({ highlightFocus: true }));
    expect(css).toContain('#ff0000');
  });

  it('bigDarkCursor adds cursor rule', () => {
    expect(buildCSS(state({ bigDarkCursor: true }))).toContain('cursor:');
  });
});
