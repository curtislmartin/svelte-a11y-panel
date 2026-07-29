<svelte:head>
  <title>Docs · svelte-a11y-panel</title>
  <meta name="description" content="Full documentation for svelte-a11y-panel: installation, configuration, theming, CSP, and browser support." />
  <link rel="canonical" href="https://a11y.clmartin.dev/docs" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Docs · svelte-a11y-panel" />
  <meta property="og:description" content="Full documentation for svelte-a11y-panel: installation, configuration, theming, CSP, and browser support." />
  <meta property="og:url" content="https://a11y.clmartin.dev/docs" />
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
  <p>Add <code>PanelMount</code> and <code>AccessibilityButton</code> to your root layout:</p>
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

&lt;AccessibilityButton accentColor="#2563eb" /&gt;

&#123;@render children()&#125;</code></pre>
  <p><code>PanelMount</code> renders nothing visible. It sets up the panel in a Shadow DOM appended to <code>document.body</code>. <code>AccessibilityButton</code> is a fixed-position floating button (bottom-right) that opens and closes the panel.</p>
  <p>No CSS imports needed. The panel manages all its own styles.</p>

  <h3>AccessibilityButton props</h3>
  <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
      </thead>
      <tbody>
        <tr><td><code>accentColor</code></td><td><code>string</code></td><td><code>'#2563eb'</code></td><td>Background colour of the button. Should match <code>PanelMount</code>'s <code>accentColor</code>.</td></tr>
        <tr><td><code>label</code></td><td><code>string</code></td><td><code>'Accessibility options'</code></td><td>Accessible label (<code>aria-label</code>) for screen readers.</td></tr>
        <tr><td><code>class</code></td><td><code>string</code></td><td><code>''</code></td><td>Additional CSS class(es) to apply to the button element.</td></tr>
      </tbody>
    </table>
  </div>
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
        <tr><td><code>accentColor</code></td><td><code>string</code></td><td><code>'#2563eb'</code></td><td>Hex colour for buttons, toggles, focus rings, and host-page overlays</td></tr>
        <tr><td><code>uiFontFamily</code></td><td><code>string</code></td><td><code>'system-ui, -apple-system, BlinkMacSystemFont, sans-serif'</code></td><td>Font for the panel UI and all overlays (link navigator, virtual keyboard)</td></tr>
        <tr><td><code>dyslexiaFontUrl</code></td><td><code>string</code></td><td>jsDelivr CDN</td><td>WOFF2 URL for OpenDyslexic font. Override to self-host.</td></tr>
        <tr><td><code>storageKey</code></td><td><code>string</code></td><td><code>'a11y-panel-state'</code></td><td><code>localStorage</code> key for persisted state</td></tr>
        <tr><td><code>positionKey</code></td><td><code>string</code></td><td><code>'a11y-panel-pos'</code></td><td><code>sessionStorage</code> key for panel position</td></tr>
        <tr><td><code>statement.orgName</code></td><td><code>string</code></td><td><code>''</code></td><td>Organisation name in the accessibility statement</td></tr>
        <tr><td><code>statement.email</code></td><td><code>string</code></td><td><code>''</code></td><td>Contact email in the accessibility statement</td></tr>
        <tr><td><code>statement.conformanceStatus</code></td><td><code>string</code></td><td><code>''</code></td><td>Optional conformance statement text</td></tr>
        <tr><td><code>statement.limitations</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Known accessibility limitations to list</td></tr>
        <tr><td><code>statement.assessmentDate</code></td><td><code>string</code></td><td><code>''</code></td><td>Date the statement was prepared</td></tr>
      </tbody>
    </table>
  </div>

  <h3>Security note</h3>
  <p>
    <code>accentColor</code> and <code>dyslexiaFontUrl</code> are interpolated into a CSS stylesheet
    injected into the Shadow DOM. Do not set these from untrusted user input. Treat config as a build-time constant.
  </p>
</section>

<!-- Init CLI -->
<section id="init-cli" class="doc-section">
  <h2>Init CLI</h2>
  <p>If you'd prefer a guided setup, run the init command from the root of your SvelteKit project:</p>
  <pre><code>npx svelte-a11y-panel init</code></pre>
  <p>The CLI will:</p>
  <ul>
    <li>Detect your SvelteKit project</li>
    <li>Ask for your accent colour, org name, contact email, and statement date</li>
    <li>Modify (or create) <code>src/routes/+layout.svelte</code> with a configured <code>PanelMount</code></li>
    <li>Show you the next step (adding <code>AccessibilityButton</code>)</li>
  </ul>
  <p>The CLI only runs when you invoke it. It is not a <code>postinstall</code> hook and never runs automatically.</p>
</section>

<!-- Theming -->
<section id="theming" class="doc-section">
  <h2>Theming</h2>
  <p>
    The panel renders inside a Shadow DOM, so your page's global CSS cannot reach it.
    Theming is done entirely through config:
  </p>
  <ul>
    <li><strong>Accent colour:</strong> set <code>accentColor</code> for buttons, toggles, focus rings, and overlays.</li>
    <li><strong>Font:</strong> set <code>uiFontFamily</code> for the panel UI and all overlays.</li>
  </ul>
  <pre><code>&lt;PanelMount config=&#123;&#123;
  accentColor: '#7c3aed',
  uiFontFamily: "'Inter', system-ui, sans-serif",
&#125;&#125; /&gt;</code></pre>
  <p>
    Colours and fonts set via CSS on the host page (including custom properties on <code>:root</code>) cannot
    reach inside the Shadow DOM. Use config instead.
  </p>
</section>

<!-- Custom statement -->
<section id="custom-statement" class="doc-section">
  <h2>Custom accessibility statement</h2>
  <p>To replace the default statement content, pass a <code>customStatement</code> snippet to <code>PanelMount</code>:</p>
  <pre><code>&lt;PanelMount config=&#123;myConfig&#125;&gt;
  &#123;#snippet customStatement()&#125;
    &lt;h2&gt;Accessibility at Example Corp&lt;/h2&gt;
    &lt;p&gt;This site aims to meet WCAG 2.2 AA. Known gaps are listed on our accessibility page.&lt;/p&gt;
    &lt;p&gt;
      Found a problem? Email
      &lt;a href="mailto:access@example.com"&gt;access@example.com&lt;/a&gt;.
    &lt;/p&gt;
  &#123;/snippet&#125;
&lt;/PanelMount&gt;</code></pre>
  <p>
    When <code>customStatement</code> is provided, the default statement is replaced entirely.
    The back button and header are still rendered.
    For simple cases (org name, email, date), use the <code>statement</code> config fields instead.
  </p>
</section>

<!-- Custom trigger -->
<section id="custom-trigger" class="doc-section">
  <h2>Custom trigger button</h2>
  <p>
    <code>AccessibilityButton</code> is intentionally simple. Build your own trigger using the state functions directly:
  </p>
  <pre><code>&lt;script&gt;
  import &#123; openPanel, closePanel, getOpen &#125; from 'svelte-a11y-panel';
  let buttonEl = $state(null);
&lt;/script&gt;

&lt;button
  bind:this=&#123;buttonEl&#125;
  onclick=&#123;() =&gt; getOpen() ? closePanel() : openPanel(buttonEl)&#125;
  aria-expanded=&#123;getOpen()&#125;
  aria-controls="a11y-panel"
  aria-label="Accessibility options"
&gt;
  Accessibility settings
&lt;/button&gt;</code></pre>
  <p>
    <code>openPanel(element)</code> takes your trigger element so the panel can return focus to it when closed.
    <code>getOpen()</code> is a reactive getter backed by Svelte 5 <code>$state</code>. It re-runs any template that reads it.
  </p>
</section>

<!-- CSP & Privacy -->
<section id="csp" class="doc-section">
  <h2>CSP &amp; privacy</h2>

  <h3>Content Security Policy</h3>
  <p>If your site uses a strict CSP, you will need to permit the following:</p>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Feature</th><th>CSP directive required</th></tr></thead>
      <tbody>
        <tr><td>Host-page style injection</td><td><code>style-src 'unsafe-inline'</code> (or a nonce)</td></tr>
        <tr><td>OpenDyslexic font (dyslexia mode)</td><td><code>font-src cdn.jsdelivr.net</code></td></tr>
        <tr><td>Self-hosted font</td><td><code>font-src 'self'</code>; set <code>dyslexiaFontUrl</code> to your own URL</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    If <code>style-src 'unsafe-inline'</code> is blocked, the panel UI still works but host-page
    effects (font overrides, contrast filters, cursor changes) will be silent no-ops.
  </p>

  <h3>Microphone access</h3>
  <p>
    Voice navigation uses the Web Speech API (<code>SpeechRecognition</code>), which requests
    <strong>microphone permission</strong> from the user the first time it is enabled.
    The library itself never records or transmits audio, but the browser's speech engine may:
    Chrome, for example, can send captured audio to Google's servers for recognition.
    You should mention microphone use in your privacy policy if you enable this feature.
  </p>

  <h3>localStorage</h3>
  <p>
    User accessibility preferences are persisted to <code>localStorage</code>.
    The panel does not intentionally store names, email addresses, or account identifiers.
  </p>

  <h3>CDN font</h3>
  <p>
    When dyslexia mode is enabled, a request is made to <code>cdn.jsdelivr.net</code>.
    To avoid this, provide your own font URL via <code>dyslexiaFontUrl</code>.
  </p>
</section>

<!-- Host page effects -->
<section id="host-effects" class="doc-section">
  <h2>Host page effects</h2>
  <p>
    When users enable accessibility features, the library actively manipulates the host page.
    These changes are how the panel applies adjustments across the site.
  </p>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Effect</th><th>What it does</th></tr></thead>
      <tbody>
        <tr><td>Style injection</td><td>Injects <code>&lt;style id="a11y-panel-host-styles"&gt;</code> into <code>&lt;head&gt;</code></td></tr>
        <tr><td>Reading guide / mask</td><td>Appends overlay <code>&lt;div&gt;</code>s to <code>&lt;body&gt;</code></td></tr>
        <tr><td>Text magnifier</td><td>Appends a magnifier <code>&lt;div&gt;</code> that follows the cursor</td></tr>
        <tr><td>Link navigator</td><td>Appends a <code>&lt;dialog&gt;</code> listing all <code>a[href]</code> elements</td></tr>
        <tr><td>Virtual keyboard</td><td>Appends a keyboard <code>&lt;div&gt;</code>; dispatches synthetic <code>KeyboardEvent</code>s</td></tr>
        <tr><td>Text-to-speech</td><td>Attaches a click listener to <code>document</code>; uses <code>window.speechSynthesis</code></td></tr>
        <tr><td>Voice navigation</td><td>Uses <code>window.SpeechRecognition</code>; calls <code>window.scrollBy</code>, <code>history.back()</code></td></tr>
        <tr><td>Navigation keys</td><td>Attaches a <code>keydown</code> listener to <code>document</code></td></tr>
        <tr><td>Mute sounds</td><td>Sets <code>muted = true</code> on all <code>&lt;audio&gt;</code> and <code>&lt;video&gt;</code> elements</td></tr>
        <tr><td>Hide emoji</td><td>Wraps emoji text nodes in <code>&lt;span&gt;</code>s with a hidden class</td></tr>
      </tbody>
    </table>
  </div>
  <p>The panel removes its injected styles, overlays, and event listeners when the relevant setting is turned off or the panel is unmounted.</p>
</section>

<!-- Browser support -->
<section id="browser-support" class="doc-section">
  <h2>Browser support</h2>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Feature</th><th>Support</th></tr></thead>
      <tbody>
        <tr><td>Panel UI</td><td>Current Chrome, Edge, Firefox, and Safari</td></tr>
        <tr><td>Text-to-speech</td><td>Current Chrome, Edge, Firefox, and Safari</td></tr>
        <tr><td>Voice navigation</td><td>Chrome, Edge, and Safari (Web Speech API; not Firefox)</td></tr>
        <tr><td>Virtual keyboard</td><td>Current Chrome, Edge, Firefox, and Safari</td></tr>
      </tbody>
    </table>
  </div>
</section>

<style>
  .doc-section {
    margin-bottom: 4rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid var(--color-border);
    scroll-margin-top: 80px;
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
  ul { margin: 0 0 1rem; padding-left: 1.5rem; }
  li { margin-bottom: 0.4rem; line-height: 1.6; }
</style>
