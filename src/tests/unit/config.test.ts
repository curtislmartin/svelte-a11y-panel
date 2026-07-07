import { describe, it, expect, beforeEach } from 'vitest';
import { DEFAULT_CONFIG } from '$lib/config';
import { setConfig, getConfig } from '$lib/effects/config';

describe('A11yPanelConfig', () => {
  beforeEach(() => {
    setConfig({});
  });

  it('DEFAULT_CONFIG has all required keys', () => {
    expect(DEFAULT_CONFIG.storageKey).toBe('a11y-panel-state');
    expect(DEFAULT_CONFIG.positionKey).toBe('a11y-panel-pos');
    expect(DEFAULT_CONFIG.accentColor).toMatch(/^#/);
    expect(DEFAULT_CONFIG.uiFontFamily).toBeTruthy();
    expect(DEFAULT_CONFIG.dyslexiaFontUrl).toContain('OpenDyslexic');
    expect(DEFAULT_CONFIG.statement.orgName).toBe('');
    expect(DEFAULT_CONFIG.statement.email).toBe('');
  });

  it('setConfig merges with defaults — partial overrides only change specified keys', () => {
    setConfig({ accentColor: '#ff0000' });
    const cfg = getConfig();
    expect(cfg.accentColor).toBe('#ff0000');
    expect(cfg.storageKey).toBe(DEFAULT_CONFIG.storageKey);
  });

  it('setConfig merges statement deeply — other statement keys stay as defaults', () => {
    setConfig({ statement: { orgName: 'Acme Corp' } });
    const cfg = getConfig();
    expect(cfg.statement.orgName).toBe('Acme Corp');
    expect(cfg.statement.email).toBe(DEFAULT_CONFIG.statement.email);
  });

  it('getConfig always returns an object with all keys', () => {
    setConfig({});
    const cfg = getConfig();
    expect(cfg).toMatchObject(DEFAULT_CONFIG);
  });
});

describe('setConfig sanitization', () => {
  beforeEach(() => {
    setConfig({});
  });

  it('accepts valid accentColor formats', () => {
    setConfig({ accentColor: '#ff0000' });
    expect(getConfig().accentColor).toBe('#ff0000');
    setConfig({ accentColor: 'rgb(10, 20, 30)' });
    expect(getConfig().accentColor).toBe('rgb(10, 20, 30)');
    setConfig({ accentColor: 'hsl(200, 50%, 40%)' });
    expect(getConfig().accentColor).toBe('hsl(200, 50%, 40%)');
  });

  it('falls back to default accentColor on CSS injection attempt', () => {
    setConfig({ accentColor: 'red; } .a11y-panel { background: url(https://evil.example/x) }' });
    expect(getConfig().accentColor).toBe(DEFAULT_CONFIG.accentColor);
  });

  it('falls back to default accentColor on non-color values', () => {
    setConfig({ accentColor: 'url(https://evil.example/x)' });
    expect(getConfig().accentColor).toBe(DEFAULT_CONFIG.accentColor);
    setConfig({ accentColor: 'expression(alert(1))' });
    expect(getConfig().accentColor).toBe(DEFAULT_CONFIG.accentColor);
  });

  it('accepts a normal uiFontFamily stack', () => {
    setConfig({ uiFontFamily: `'Helvetica Neue', "Segoe UI", system-ui, sans-serif` });
    expect(getConfig().uiFontFamily).toBe(`'Helvetica Neue', "Segoe UI", system-ui, sans-serif`);
  });

  it('falls back to default uiFontFamily on CSS injection attempt', () => {
    setConfig({ uiFontFamily: 'serif; } .a11y-panel { display: none' });
    expect(getConfig().uiFontFamily).toBe(DEFAULT_CONFIG.uiFontFamily);
    setConfig({ uiFontFamily: 'url(https://evil.example/x)' });
    expect(getConfig().uiFontFamily).toBe(DEFAULT_CONFIG.uiFontFamily);
    setConfig({ uiFontFamily: '@import "https://evil.example/x"' });
    expect(getConfig().uiFontFamily).toBe(DEFAULT_CONFIG.uiFontFamily);
  });
});
