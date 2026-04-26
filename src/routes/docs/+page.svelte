<svelte:head>
  <title>Docs — svelte-a11y-panel</title>
  <meta name="description" content="Full documentation for svelte-a11y-panel." />
</svelte:head>

<!-- Installation -->
<section id="installation" class="doc-section">
  <h1>Installation</h1>
  <p>Install the package from npm:</p>
  <pre><code>pnpm add svelte-a11y-panel
# or
npm install svelte-a11y-panel
# or
yarn add svelte-a11y-panel</code></pre>
  <p><strong>Requirements:</strong> Svelte 5 (runes), SvelteKit 2+, Node 18+.</p>
</section>

<!-- Quick start -->
<section id="quick-start" class="doc-section">
  <h2>Quick start</h2>
  <p>Add <code>PanelMount</code> to your root layout and place <code>AccessibilityButton</code> wherever you want the trigger button to appear:</p>
  <pre><code>&lt;!-- src/routes/+layout.svelte --&gt;
&lt;script&gt;
  import &#123; PanelMount, AccessibilityButton &#125; from 'svelte-a11y-panel';
  let &#123; children &#125; = $props();
&lt;/script&gt;

&lt;PanelMount config=&#123;&#123;
  accentColor: '#2563eb',
  statement: &#123;
    orgName: 'My Organisation',
    email: 'accessibility@mysite.com',
    assessmentDate: 'January 2026',
  &#125;
&#125;&#125; /&gt;

&lt;AccessibilityButton /&gt;

&#123;@render children()&#125;</code></pre>
  <p><code>PanelMount</code> renders nothing visible — it sets up the panel in a Shadow DOM appended to <code>document.body</code>. <code>AccessibilityButton</code> is a minimal unstyled button that opens and closes the panel.</p>
  <p>No CSS imports needed. The panel manages all its own styles.</p>
</section>

<!-- Configuration -->
<section id="configuration" class="doc-section">
  <h2>Configuration</h2>
  <p>Pass a config object to <code>PanelMount</code>:</p>
  <pre><code>&lt;PanelMount config=&#123;myConfig&#125; /&gt;</code></pre>

  <h3>Full config reference</h3>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>accentColor</code></td><td><code>string</code></td><td><code>'#2563eb'</code></td><td>Hex colour for overlays, highlights, and focus rings</td></tr>
        <tr><td><code>uiFontFamily</code></td><td><code>string</code></td><td><code>'system-ui, sans-serif'</code></td><td>Font for overlays (link navigator, virtual keyboard)</td></tr>
        <tr><td><code>dyslexiaFontUrl</code></td><td><code>string</code></td><td>jsDelivr CDN</td><td>WOFF2 URL for OpenDyslexic font. Override to self-host.</td></tr>
        <tr><td><code>storageKey</code></td><td><code>string</code></td><td><code>'a11y-panel-state'</code></td><td><code>localStorage</code> key for persisted state</td></tr>
        <tr><td><code>positionKey</code></td><td><code>string</code></td><td><code>'a11y-panel-pos'</code></td><td><code>sessionStorage</code> key for panel position</td></tr>
        <tr><td><code>statement.orgName</code></td><td><code>string</code></td><td><code>''</code></td><td>Organisation name in the accessibility statement</td></tr>
        <tr><td><code>statement.email</code></td><td><code>string</code></td><td><code>''</code></td><td>Contact email in the accessibility statement</td></tr>
        <tr><td><code>statement.conformanceStatus</code></td><td><code>string</code></td><td>WCAG 2.1 AA string</td><td>Conformance statement text</td></tr>
        <tr><td><code>statement.limitations</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Known accessibility limitations to list</td></tr>
        <tr><td><code>statement.assessmentDate</code></td><td><code>string</code></td><td><code>''</code></td><td>Date the statement was prepared</td></tr>
      </tbody>
    </table>
  </div>

  <h3>Security note</h3>
  <p>
    <code>accentColor</code> and <code>dyslexiaFontUrl</code> are interpolated into a CSS stylesheet
    injected into the host page. Do not set these from untrusted user input. Treat config as a build-time constant.
  </p>
</section>

<style>
  .doc-section {
    margin-bottom: 4rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--color-border);
  }
  .doc-section:last-child { border-bottom: none; }
  h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; }
  h2 { font-size: 1.5rem; font-weight: 700; margin: 2rem 0 1rem; }
  h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
  p { margin: 0 0 1rem; line-height: 1.7; }
  pre { margin-bottom: 1.25rem; }
  .table-wrap { overflow-x: auto; margin-bottom: 1.25rem; }
  table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
  th { text-align: left; padding: 0.6rem 0.75rem; background: var(--color-sidebar-bg); border-bottom: 2px solid var(--color-border); font-weight: 600; }
  td { padding: 0.6rem 0.75rem; border-bottom: 1px solid var(--color-border); vertical-align: top; }
  td:first-child code { white-space: nowrap; }
</style>
