<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import type { A11yPanelConfig } from './config';
  import { setConfig, getConfig } from './effects/config';
  import { getOpen } from './panelState.svelte';
  import { load as loadState } from './effects/persist';
  import { apply as applyStyles } from './effects/hostStyles';

  let { config = {}, customStatement }: { config?: A11yPanelConfig; customStatement?: Snippet } = $props();

  // Apply config before any effects can read it
  setConfig(config);

  let initialized = false;
  let shadowHost: HTMLDivElement | null = null;
  let destroy: (() => void) | null = null;
  let themeObserver: MutationObserver | null = null;
  const persistedState = loadState();

  async function initPanel() {
    if (initialized) return;
    initialized = true;

    const [{ mount, unmount }, { default: AccessibilityPanel }, { default: panelCss }] =
      await Promise.all([
        import('svelte'),
        import('./AccessibilityPanel.svelte'),
        import('./panelStyles'),
      ]);

    shadowHost = document.createElement('div');
    shadowHost.setAttribute('aria-hidden', 'true');
    shadowHost.setAttribute('data-a11y-panel-host', '');
    document.body.appendChild(shadowHost);

    const shadow = shadowHost.attachShadow({ mode: 'open' });

    const styleEl = document.createElement('style');
    styleEl.textContent = panelCss;
    shadow.appendChild(styleEl);

    // Override accent colour from config
    const accentStyleEl = document.createElement('style');
    accentStyleEl.textContent = `.a11y-panel { --a11y-primary: ${getConfig().accentColor}; }`;
    shadow.appendChild(accentStyleEl);

    // Sync host-page dark mode toggle into shadow host so :host([data-theme]) selectors work
    function syncTheme() {
      const t = document.documentElement.getAttribute('data-theme');
      if (t) shadowHost!.setAttribute('data-theme', t);
      else shadowHost!.removeAttribute('data-theme');
    }
    syncTheme();
    themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    const instance = mount(AccessibilityPanel, {
      target: mountPoint,
      props: { initialState: persistedState, customStatement },
    });
    destroy = () => unmount(instance);
  }

  $effect(() => {
    if (getOpen() && !initialized && typeof window !== 'undefined') {
      initPanel();
    }
  });

  onMount(() => {
    applyStyles(persistedState);
    return () => {
      destroy?.();
      shadowHost?.remove();
      themeObserver?.disconnect();
    };
  });
</script>
