// Single source of truth for whether the panel is open.
// Imported directly by both the trigger button and PanelMount.
let open = $state(false);
let triggerEl = $state(null);
export function openPanel(trigger) {
    triggerEl = trigger;
    open = true;
}
export function closePanel() {
    open = false;
    triggerEl?.focus();
}
export function getOpen() { return open; }
export function getTriggerEl() { return triggerEl; }
