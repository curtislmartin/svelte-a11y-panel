import type { A11yPanelConfig, A11yPanelStatementConfig } from '../config';
import { DEFAULT_CONFIG } from '../config';
import { safeColor, safeFontFamily } from './sanitize';

type ResolvedConfig = Required<Omit<A11yPanelConfig, 'statement'>> & {
  statement: Required<A11yPanelStatementConfig>;
};

let current: ResolvedConfig = structuredClone(DEFAULT_CONFIG);

export function setConfig(cfg: A11yPanelConfig): void {
  const merged = {
    ...DEFAULT_CONFIG,
    ...cfg,
    statement: { ...DEFAULT_CONFIG.statement, ...cfg.statement },
  };

  // Config values are interpolated into <style> elements and inline styles,
  // so reject anything that isn't a plain colour / font stack.
  const accentColor = safeColor(merged.accentColor, DEFAULT_CONFIG.accentColor);
  if (accentColor !== merged.accentColor) {
    console.warn(`[svelte-a11y-panel] accentColor "${merged.accentColor}" is not a valid CSS color value and has been ignored. Use hex (#rrggbb), rgb(), rgba(), or hsl() format.`);
  }
  const uiFontFamily = safeFontFamily(merged.uiFontFamily, DEFAULT_CONFIG.uiFontFamily);
  if (uiFontFamily !== merged.uiFontFamily) {
    console.warn(`[svelte-a11y-panel] uiFontFamily "${merged.uiFontFamily}" contains characters not allowed in a font stack and has been ignored.`);
  }

  current = { ...merged, accentColor, uiFontFamily };
}

export function getConfig(): ResolvedConfig {
  return current;
}
