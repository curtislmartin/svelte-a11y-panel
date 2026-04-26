import type { Snippet } from 'svelte';
import { type PanelState } from './types';
type $$ComponentProps = {
    initialState?: PanelState;
    customStatement?: Snippet;
};
declare const AccessibilityPanel: import("svelte").Component<$$ComponentProps, {}, "">;
type AccessibilityPanel = ReturnType<typeof AccessibilityPanel>;
export default AccessibilityPanel;
