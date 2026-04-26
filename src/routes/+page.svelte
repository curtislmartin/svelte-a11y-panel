<script lang="ts">
  const FEATURES = [
    { icon: '🛡️', title: 'Shadow DOM isolated', desc: "Panel CSS is fully isolated — it cannot affect your site's styles." },
    { icon: '⚡', title: 'Zero runtime deps', desc: 'The published package includes only its own code. Nothing extra installed.' },
    { icon: '🎨', title: 'Fully configurable', desc: 'Brand colours, fonts, org name, contact email — all configurable.' },
    { icon: '♿', title: '20+ features', desc: 'Profiles, contrast modes, font overrides, TTS, voice nav, virtual keyboard, and more.' },
    { icon: '🔒', title: 'Security audited', desc: 'CSS injection protection, localStorage schema validation, CSP documented.' },
    { icon: '📦', title: 'TypeScript ready', desc: 'Full type exports for A11yPanelConfig, PanelState, and all public APIs.' },
  ];
</script>

<svelte:head>
  <title>svelte-a11y-panel — Accessibility panel for Svelte 5</title>
  <meta name="description" content="A configurable, open-source accessibility panel for Svelte 5. Drop it into any SvelteKit app in two lines." />
</svelte:head>

<main>
  <!-- Hero -->
  <section class="hero">
    <div class="hero-inner">
      <div class="hero-badge">Svelte 5 · Zero runtime deps · MIT</div>
      <h1 class="hero-title">Accessibility panel<br/>for Svelte&nbsp;5</h1>
      <p class="hero-subtitle">
        Lets visitors adjust your site for their needs — contrast, fonts, cursors,
        TTS, voice nav, and more. Drops into any SvelteKit project in two lines.
        No CSS required.
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
        <p class="demo-label">Try it live — tap the button floating in the bottom right ↘</p>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="features">
    <div class="features-inner">
      <h2 class="section-title">Everything your users need</h2>
      <div class="features-grid">
        {#each FEATURES as f}
          <div class="feature-card">
            <div class="feature-icon" aria-hidden="true">{f.icon}</div>
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
      <h2 class="section-title">Two lines to install</h2>
      <p class="section-sub">Add to your root layout. No CSS, no config files, no build plugins.</p>
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
  <footer class="site-footer">
    <div class="footer-inner">
      <span>MIT License · Built by <a href="https://github.com/curtislmartin" target="_blank" rel="noopener">Curtis Martin</a></span>
      <a href="https://github.com/curtislmartin/svelte-a11y-panel" target="_blank" rel="noopener">GitHub</a>
    </div>
  </footer>
</main>

<style>
  main { display: flex; flex-direction: column; }

  /* Hero */
  .hero {
    padding: 5rem 1.5rem 4rem;
    background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%);
    border-bottom: 1px solid var(--color-border);
  }
  .hero-inner {
    max-width: 680px;
    margin: 0 auto;
    text-align: center;
  }
  .hero-badge {
    display: inline-block;
    background: #e0edff;
    color: #1e40af;
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
  .feature-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
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

  /* Footer */
  .site-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
  }
  .footer-inner {
    max-width: var(--max-width);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: var(--color-text-muted);
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>
