import type { A11yPanelConfig, A11yPanelStatementConfig } from '../config';
import { DEFAULT_CONFIG } from '../config';

type ResolvedConfig = Required<Omit<A11yPanelConfig, 'statement'>> & {
  statement: Required<A11yPanelStatementConfig>;
};

let current: ResolvedConfig = structuredClone(DEFAULT_CONFIG);

export function setConfig(cfg: A11yPanelConfig): void {
  current = {
    ...DEFAULT_CONFIG,
    ...cfg,
    statement: { ...DEFAULT_CONFIG.statement, ...cfg.statement },
  };
}

export function getConfig(): ResolvedConfig {
  return current;
}
