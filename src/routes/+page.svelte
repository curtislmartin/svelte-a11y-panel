<script lang="ts">
  // Icon paths are inlined Lucide outlines (ISC licence), same style as the header logo.
  const FEATURES = [
    {
      paths: ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'],
      title: 'Shadow DOM isolated',
      desc: "The panel renders in its own Shadow DOM, isolating its styles from your site's CSS.",
    },
    {
      paths: ['m7.5 4.27 9 5.15', 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z', 'm3.3 7 8.7 5 8.7-5', 'M12 22V12'],
      title: 'Zero runtime dependencies',
      desc: 'The published package ships only its own code. Nothing extra lands in your node_modules or your bundle.',
    },
    {
      paths: ['M3 6h10', 'M17 6h4', 'M15 4v4', 'M3 12h4', 'M11 12h10', 'M9 10v4', 'M3 18h12', 'M19 18h2', 'M17 16v4'],
      title: 'Configurable',
      desc: 'Brand colour, font, organisation name, contact email, and storage keys are all set from one config object.',
    },
    {
      paths: ['M13 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0', 'm9 20 3-6 3 6', 'm6 8 6 2 6-2', 'M12 10v4'],
      title: '30+ adjustments',
      desc: 'Five profiles plus individual controls: contrast modes, font overrides, reading guides, text-to-speech, voice navigation, virtual keyboard.',
    },
    {
      paths: ['M6 11h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z', 'M8 11V7a4 4 0 0 1 8 0v4'],
      title: 'Security-conscious',
      desc: 'Colour and URL config values are sanitised before injection, persisted state is schema-validated, and CSP requirements are documented.',
    },
    {
      paths: ['M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1', 'M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1'],
      title: 'Typed API',
      desc: 'TypeScript exports for A11yPanelConfig, PanelState, and the public functions.',
    },
  ];
</script>

<svelte:head>
  <title>svelte-a11y-panel · Accessibility panel for Svelte 5</title>
  <meta name="description" content="A configurable, open-source accessibility panel for Svelte 5. Two components in your SvelteKit layout give visitors contrast modes, font overrides, and text-to-speech." />
  <link rel="canonical" href="https://a11y.clmartin.dev/" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="svelte-a11y-panel · Accessibility panel for Svelte 5" />
  <meta property="og:description" content="A configurable, open-source accessibility panel for Svelte 5. Two components in your SvelteKit layout give visitors contrast modes, font overrides, and text-to-speech." />
  <meta property="og:url" content="https://a11y.clmartin.dev/" />
</svelte:head>

<main id="main" tabindex="-1">
  <!-- Hero -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">Svelte 5 · Zero runtime deps · MIT</div>
      <h1 class="hero-title">Accessibility panel<br/>for Svelte&nbsp;5</h1>
      <p class="hero-subtitle">
        Add contrast, text, navigation, and reading controls to a Svelte 5 site.
        Install the package, mount the panel in your root layout, and choose
        which settings to expose.
      </p>
      <div class="hero-actions">
        <a href="/docs" class="btn btn-primary">Get started</a>
        <a
          href="https://github.com/curtislmartin/svelte-a11y-panel"
          target="_blank"
          rel="noopener"
          class="btn btn-ghost"
        >View on GitHub</a>
      </div>
      <div class="hero-demo">
        <p class="demo-label">Try it live: tap the button floating in the bottom right ↘</p>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="features">
    <div class="features-inner">
      <h2 class="section-title">What's in the panel</h2>
      <div class="features-grid">
        {#each FEATURES as f}
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                {#each f.paths as d}<path {d} />{/each}
              </svg>
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Quick start -->
  <section class="quickstart">
    <div class="quickstart-inner">
      <h2 class="section-title">Two components to install</h2>
      <p class="section-sub">Add both components to your root layout:</p>
      <div class="code-block">
        <div class="code-label">Terminal</div>
        <pre><code>pnpm add svelte-a11y-panel</code></pre>
      </div>
      <div class="code-block">
        <div class="code-label">src/routes/+layout.svelte</div>
        <pre><code>&lt;script&gt;
  import &#123; PanelMount, AccessibilityButton &#125; from 'svelte-a11y-panel';
  let &#123; children &#125; = $props();
&lt;/script&gt;

&lt;PanelMount config=&#123;&#123; accentColor: '#2563eb' &#125;&#125; /&gt;
&lt;AccessibilityButton /&gt;

&#123;@render children()&#125;</code></pre>
      </div>
      <div class="quickstart-actions">
        <a href="/docs" class="btn btn-primary">Read the docs</a>
        <a href="/docs#init-cli" class="btn btn-ghost">Or use the setup CLI →</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
</main>

<style>
  main { display: flex; flex-direction: column; }

  /* Hero */
  .hero {
    padding: 5rem 1.5rem 4rem;
    background: var(--color-hero-bg);
    border-bottom: 1px solid var(--color-border);
  }
  .hero-inner {
    max-width: 680px;
    margin: 0 auto;
    text-align: center;
  }
  .hero-badge {
    display: inline-block;
    background: var(--color-hero-badge-bg);
    color: var(--color-hero-badge-text);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.3rem 0.9rem;
    border-radius: 999px;
    margin-bottom: 1.5rem;
    letter-spacing: 0.02em;
  }
  .hero-title {
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 1.25rem;
    color: var(--color-heading);
  }
  .hero-subtitle {
    font-size: 1.15rem;
    color: var(--color-text-muted);
    max-width: 520px;
    margin: 0 auto 2rem;
    line-height: 1.7;
  }
  .hero-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }
  .hero-demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  .demo-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  /* Features */
  .features { padding: 4rem 1.5rem; }
  .features-inner {
    max-width: var(--max-width);
    margin: 0 auto;
  }
  .section-title {
    font-size: 1.75rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.75rem;
  }
  .section-sub {
    text-align: center;
    color: var(--color-text-muted);
    margin-bottom: 2.5rem;
    font-size: 1.05rem;
  }
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
  }
  .feature-card {
    background: var(--color-sidebar-bg);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 1.5rem;
  }
  .feature-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 8px;
    background: var(--color-hero-badge-bg);
    color: var(--color-hero-badge-text);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  }
  .feature-card h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.4rem; }
  .feature-card p { font-size: 0.9rem; color: var(--color-text-muted); margin: 0; line-height: 1.5; }

  /* Quick start */
  .quickstart {
    padding: 4rem 1.5rem;
    background: var(--color-sidebar-bg);
    border-top: 1px solid var(--color-border);
    border-bottom: 1px solid var(--color-border);
  }
  .quickstart-inner { max-width: 680px; margin: 0 auto; }
  .code-block { margin-bottom: 1rem; }
  .code-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--color-text-muted);
    margin-bottom: 0.4rem;
  }
  .quickstart-actions {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-top: 2rem;
  }

</style>
