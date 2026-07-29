// Main components
export { default as PanelMount } from './PanelMount.svelte';
export { default as AccessibilityButton } from './AccessibilityButton.svelte';

// State for custom trigger buttons
export { openPanel, closePanel, getOpen } from './panelState.svelte';

// Types
export type { PanelState } from './types';
export { DEFAULT_STATE, PROFILES, PROFILE_SETTINGS } from './types';
export type { A11yPanelConfig, A11yPanelStatementConfig } from './config';
export { DEFAULT_CONFIG } from './config';
