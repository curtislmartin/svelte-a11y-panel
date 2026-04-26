<script lang="ts">
  import '../app.css';
  import { PanelMount } from '$lib';

  let { children } = $props();
</script>

<PanelMount config={{
  accentColor: '#2563eb',
  statement: {
    orgName: 'svelte-a11y-panel demo',
    email: 'curtislmartin2008@gmail.com',
    conformanceStatus: 'We aim to conform to WCAG 2.1 Level AA.',
    assessmentDate: 'April 2026',
  }
}} />

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">
      <span class="logo-icon" aria-hidden="true">♿</span>
      <span class="logo-text">svelte-a11y-panel</span>
    </a>
    <nav class="header-nav" aria-label="Site navigation">
      <a href="/docs">Docs</a>
      <a
        href="https://github.com/curtislmartin/svelte-a11y-panel"
        target="_blank"
        rel="noopener"
        class="btn btn-ghost"
      >GitHub</a>
    </nav>
  </div>
</header>

{@render children()}

<style>
  .site-header {
    position: sticky;
    top: 0;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--color-border);
    z-index: 100;
  }
  .header-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 1.5rem;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--color-heading);
    text-decoration: none;
  }
  .logo-icon { font-size: 1.3rem; }
  .header-nav {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }
  .header-nav a { color: var(--color-text); font-size: 0.95rem; }
  .header-nav a:hover { color: var(--color-accent); text-decoration: none; }
</style>
