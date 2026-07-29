// Traps Tab / Shift-Tab focus within the element.
// Works inside a shadow root: queries within the node, not the full document.
export function focusTrap(node: HTMLElement) {
  const FOCUSABLE = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  function getFocusable() {
    return [...node.querySelectorAll<HTMLElement>(FOCUSABLE)];
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const els = getFocusable();
    if (!els.length) { e.preventDefault(); return; }
    const first = els[0];
    const last = els[els.length - 1];
    const active = node.getRootNode() instanceof ShadowRoot
      ? (node.getRootNode() as ShadowRoot).activeElement
      : document.activeElement;
    if (e.shiftKey) {
      if (active === first) { e.preventDefault(); last.focus(); }
    } else {
      if (active === last) { e.preventDefault(); first.focus(); }
    }
  }

  node.addEventListener('keydown', handleKeydown);

  // Focus first focusable on mount
  const first = getFocusable()[0];
  first?.focus();

  return {
    destroy() { node.removeEventListener('keydown', handleKeydown); }
  };
}
