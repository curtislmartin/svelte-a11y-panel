<script lang="ts">
  let { children } = $props();

  const NAV = [
    { label: 'Installation', href: '#installation' },
    { label: 'Quick start', href: '#quick-start' },
    { label: 'Configuration', href: '#configuration' },
    { label: 'Init CLI', href: '#init-cli' },
    { label: 'Theming', href: '#theming' },
    { label: 'Custom statement', href: '#custom-statement' },
    { label: 'Custom trigger', href: '#custom-trigger' },
    { label: 'CSP & privacy', href: '#csp' },
    { label: 'Host page effects', href: '#host-effects' },
  ];
</script>

<div class="docs-shell">
  <aside class="sidebar" aria-label="Documentation navigation">
    <div class="sidebar-inner">
      <p class="sidebar-heading">Documentation</p>
      <nav>
        {#each NAV as item}
          <a href={item.href} class="sidebar-link">{item.label}</a>
        {/each}
      </nav>
    </div>
  </aside>
  <main class="docs-content" id="main">
    {@render children()}
  </main>
</div>

<footer class="docs-footer">
  <div class="docs-footer-inner">
    <span>svelte-a11y-panel · MIT licence</span>
    <a href="https://github.com/curtislmartin/svelte-a11y-panel" target="_blank" rel="noopener">GitHub</a>
  </div>
</footer>

<style>
  .docs-shell {
    display: flex;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem;
    gap: 3rem;
    align-items: flex-start;
  }
  .sidebar {
    width: var(--sidebar-width);
    flex-shrink: 0;
    position: sticky;
    top: 80px;
    padding: 2rem 0;
  }
  .sidebar-heading {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted);
    margin: 0 0 0.75rem;
  }
  .sidebar-link {
    display: block;
    padding: 0.35rem 0;
    font-size: 0.9rem;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color 0.1s;
  }
  .sidebar-link:hover { color: var(--color-accent); }
  .docs-content {
    flex: 1;
    min-width: 0;
    padding: 2.5rem 0 4rem;
  }
  @media (max-width: 720px) {
    .docs-shell { flex-direction: column; }
    .sidebar { position: static; width: 100%; padding: 1.5rem 0 0; }
  }
  .docs-footer {
    border-top: 1px solid var(--color-border);
    margin-top: 2rem;
  }
  .docs-footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
  .docs-footer-inner a { color: var(--color-text-muted); text-decoration: none; }
  .docs-footer-inner a:hover { color: var(--color-accent); }
</style>
