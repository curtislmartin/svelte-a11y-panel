<script lang="ts">
  import { onMount } from 'svelte';
  import type { A11yPanelConfig } from './config';
  import { setConfig } from './effects/config';
  import { getOpen } from './panelState.svelte';
  import { load as loadState } from './effects/persist';
  import { apply as applyStyles } from './effects/hostStyles';

  let { config = {} }: { config?: A11yPanelConfig } = $props();

  // Apply config before any effects can read it
  setConfig(config);

  let initialized = false;
  let shadowHost: HTMLDivElement | null = null;
  let destroy: (() => void) | null = null;
  const persistedState = loadState();

  async function initPanel() {
    if (initialized) return;
    initialized = true;

    const [{ mount, unmount }, { default: AccessibilityPanel }, { default: panelCss }] =
      await Promise.all([
        import('svelte'),
        import('./AccessibilityPanel.svelte'),
        import('./panel.css?inline'),
      ]);

    shadowHost = document.createElement('div');
    shadowHost.setAttribute('aria-hidden', 'true');
    shadowHost.setAttribute('data-a11y-panel-host', '');
    document.body.appendChild(shadowHost);

    const shadow = shadowHost.attachShadow({ mode: 'open' });

    const styleEl = document.createElement('style');
    styleEl.textContent = panelCss;
    shadow.appendChild(styleEl);

    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    const instance = mount(AccessibilityPanel, {
      target: mountPoint,
      props: { initialState: persistedState },
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
    };
  });
</script>
