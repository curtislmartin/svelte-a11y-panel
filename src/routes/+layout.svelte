<script lang="ts">
  import '../app.css';
  import { PanelMount, AccessibilityButton } from '$lib';
  import { onMount } from 'svelte';

  let { children } = $props();

  let dark = $state(false);

  onMount(() => {
    const saved = localStorage.getItem('docs-theme');
    if (saved) {
      dark = saved === 'dark';
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // No data-theme set — CSS @media handles it automatically
    }
  });

  function toggleDark() {
    dark = !dark;
    const theme = dark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('docs-theme', theme);
  }
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

<AccessibilityButton accentColor="#2563eb" />

<header class="site-header">
  <div class="header-inner">
    <a href="/" class="logo">
      <span class="logo-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="1"/>
          <path d="m9 20 3-6 3 6"/>
          <path d="m6 8 6 2 6-2"/>
          <path d="M12 10v4"/>
        </svg>
      </span>
      <span class="logo-text">svelte-a11y-panel</span>
    </a>
    <nav class="header-nav" aria-label="Site navigation">
      <a href="/docs" class="nav-link">Docs</a>
      <a
        href="https://github.com/curtislmartin/svelte-a11y-panel"
        target="_blank"
        rel="noopener"
        class="nav-link"
      >GitHub</a>
      <button
        class="theme-toggle"
        onclick={toggleDark}
        aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {#if dark}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
          </svg>
        {:else}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>
    </nav>
  </div>
</header>

{@render children()}

<style>
  .site-header {
    position: sticky;
    top: 0;
    background: var(--color-header-bg);
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
  .logo-icon {
    width: 2rem;
    height: 2rem;
    background: var(--color-accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .header-nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .nav-link {
    color: var(--color-text-muted);
    font-size: 0.9rem;
    font-weight: 500;
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    transition: color 0.1s, background 0.1s;
    text-decoration: none;
  }
  .nav-link:hover { color: var(--color-heading); background: var(--color-sidebar-bg); text-decoration: none; }
  .theme-toggle {
    background: none;
    border: none;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 0.4rem 0.5rem;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.1s, background 0.1s;
    line-height: 1;
  }
  .theme-toggle:hover { color: var(--color-heading); background: var(--color-sidebar-bg); }
</style>
