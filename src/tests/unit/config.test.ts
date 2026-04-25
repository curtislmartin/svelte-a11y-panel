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
