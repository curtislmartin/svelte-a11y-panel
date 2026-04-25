export interface A11yPanelStatementConfig {
    orgName?: string;
    email?: string;
    conformanceStatus?: string;
    limitations?: string[];
    assessmentDate?: string;
}
export interface A11yPanelConfig {
    storageKey?: string;
    positionKey?: string;
    accentColor?: string;
    uiFontFamily?: string;
    dyslexiaFontUrl?: string;
    statement?: A11yPanelStatementConfig;
}
export declare const DEFAULT_CONFIG: Readonly<Required<Omit<A11yPanelConfig, 'statement'>> & {
    statement: Readonly<Required<A11yPanelStatementConfig>>;
}>;
