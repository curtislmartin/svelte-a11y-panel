import type { A11yPanelConfig, A11yPanelStatementConfig } from '../config';
type ResolvedConfig = Required<Omit<A11yPanelConfig, 'statement'>> & {
    statement: Required<A11yPanelStatementConfig>;
};
export declare function setConfig(cfg: A11yPanelConfig): void;
export declare function getConfig(): ResolvedConfig;
export {};
