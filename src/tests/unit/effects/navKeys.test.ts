import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('navKeys', () => {
  beforeEach(() => {
    document.body.innerHTML = '<main><h1 id="h1">Title</h1><button id="btn">Click</button></main>';
    HTMLElement.prototype.scrollIntoView = vi.fn();
    // jsdom returns null for offsetParent; stub it so queryVisible doesn't filter out all elements
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      get() { return document.body; },
      configurable: true,
    });
  });

  afterEach(async () => {
    const { stop } = await import('$lib/effects/navKeys');
    stop();
  });

  it('pressing H focuses the first heading', async () => {
    const { start } = await import('$lib/effects/navKeys');
    start();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'H', bubbles: true }));
    expect(document.activeElement?.id).toBe('h1');
  });

  it('pressing B focuses the first button', async () => {
    const { start } = await import('$lib/effects/navKeys');
    start();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'B', bubbles: true }));
    expect(document.activeElement?.id).toBe('btn');
  });

  it('stop: pressing H after stop does not change focus', async () => {
    const { start, stop } = await import('$lib/effects/navKeys');
    start();
    stop();
    const spy = vi.spyOn(HTMLElement.prototype, 'focus');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'H', bubbles: true }));
    expect(spy).not.toHaveBeenCalled();
  });
});
