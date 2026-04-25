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

export const DEFAULT_CONFIG: Readonly<Required<Omit<A11yPanelConfig, 'statement'>> & {
  statement: Readonly<Required<A11yPanelStatementConfig>>;
}> = {
  storageKey: 'a11y-panel-state',
  positionKey: 'a11y-panel-pos',
  accentColor: '#2563eb',
  uiFontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  dyslexiaFontUrl:
    'https://cdn.jsdelivr.net/gh/antijingoist/opendyslexic@master/compiled/OpenDyslexic-Regular.woff2',
  statement: {
    orgName: '',
    email: '',
    conformanceStatus:
      'We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.',
    limitations: [],
    assessmentDate: '',
  },
};
