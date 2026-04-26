# Init CLI + Docs Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an optional `npx svelte-a11y-panel init` setup CLI that scaffolds the library into a user's project, and build a public docs + demo site deployed to Vercel.

**Architecture:** Two independent deliverables in the same repo. (1) A bundled Node.js CLI in `bin/init.js` built with `tsup` from `src/init/` — it interactively asks the user for config values and injects `PanelMount` into their layout file. (2) A SvelteKit docs + demo site in `src/routes/` with a home page (hero + live demo) and a full docs page (installation, config API, init CLI, CSP, theming) — deployed to Vercel via `@sveltejs/adapter-vercel`. The library code in `src/lib/` is not touched.

**Tech Stack:** Svelte 5, SvelteKit 2, TypeScript, `tsup` (CLI bundler), `@clack/prompts` (CLI UX, bundled into bin — no runtime dep added to library), `@sveltejs/adapter-vercel`, plain CSS (no Tailwind).

---

## Scope note

Tasks 1–3 are the init CLI. Tasks 4–10 are the docs site. Tasks 11–12 are deployment and README. These two tracks are independent — if you want to split them into separate execution sessions, Tasks 1–3 + 12 stand alone, and Tasks 4–11 + 12 stand alone.

---

## File structure

### New files

```
tsup.config.ts                          — tsup config to bundle the CLI
src/init/
  index.ts                              — main CLI entry (prompts + orchestration)
  detect.ts                             — detect SvelteKit project + find layout
  codegen.ts                            — generate/modify layout file content
bin/
  init.js                               — bundled CLI output (published to npm)
src/routes/
  +layout.svelte                        — site shell: nav + PanelMount running on site
  +page.svelte                          — home page: hero, features, live demo, install snippet
  docs/
    +layout.svelte                      — docs layout: sidebar + content area
    +page.svelte                        — full docs page (all sections, anchor nav)
src/app.css                             — global styles for the docs site
```

### Modified files

```
package.json                            — add bin, update files/scripts/devDeps
svelte.config.js                        — add @sveltejs/adapter-vercel
README.md                               — add docs site URL + init CLI section
```

---

## Task 1: CLI scaffolding

**Files:**
- Modify: `package.json`
- Create: `tsup.config.ts`
- Create: `src/init/index.ts` (empty)
- Create: `src/init/detect.ts` (empty)
- Create: `src/init/codegen.ts` (empty)

- [ ] **Step 1: Install tsup and @clack/prompts as devDependencies**

```bash
cd /home/clm/Work/svelte-a11y-panel
pnpm add -D tsup @clack/prompts
```

Expected: both packages appear in `package.json` devDependencies.

- [ ] **Step 2: Create tsup.config.ts**

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { init: 'src/init/index.ts' },
  format: ['esm'],
  outDir: 'bin',
  banner: { js: '#!/usr/bin/env node' },
  bundle: true,
  platform: 'node',
  target: 'node18',
  noExternal: ['@clack/prompts'],
  clean: false,
  dts: false,
});
```

- [ ] **Step 3: Update package.json**

Add `"bin"` field, update `"files"` to include `bin/`, add new scripts. The full updated relevant sections:

```json
{
  "bin": {
    "svelte-a11y-panel": "./bin/init.js"
  },
  "files": ["dist", "bin"],
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "build:cli": "tsup",
    "build:all": "pnpm build:cli && pnpm package",
    "package": "svelte-package && publint",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lint": "prettier --check ."
  }
}
```

- [ ] **Step 4: Create empty source files**

```bash
touch /home/clm/Work/svelte-a11y-panel/src/init/index.ts
touch /home/clm/Work/svelte-a11y-panel/src/init/detect.ts
touch /home/clm/Work/svelte-a11y-panel/src/init/codegen.ts
mkdir -p /home/clm/Work/svelte-a11y-panel/bin
```

- [ ] **Step 5: Verify tsup can run (will fail with empty entry but should import correctly)**

```bash
cd /home/clm/Work/svelte-a11y-panel
echo "export {};" > src/init/index.ts
pnpm build:cli
```

Expected: `bin/init.js` is created. May be empty/minimal — that's fine.

- [ ] **Step 6: Commit**

```bash
git add package.json tsup.config.ts src/init/ bin/
git commit -m "feat: scaffold init CLI — tsup config, bin entry, package.json updates"
```

---

## Task 2: Project detection utilities

**Files:**
- Modify: `src/init/detect.ts`

- [ ] **Step 1: Write detect.ts**

```typescript
// src/init/detect.ts
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

export function isSvelteKitProject(cwd: string): boolean {
  return (
    existsSync(join(cwd, 'svelte.config.js')) ||
    existsSync(join(cwd, 'svelte.config.ts'))
  );
}

export function findLayoutPath(cwd: string): string {
  return join(cwd, 'src', 'routes', '+layout.svelte');
}

export function readLayoutIfExists(cwd: string): string | null {
  const p = findLayoutPath(cwd);
  return existsSync(p) ? readFileSync(p, 'utf-8') : null;
}

export function alreadyInstalled(cwd: string): boolean {
  const content = readLayoutIfExists(cwd);
  return content !== null && content.includes("from 'svelte-a11y-panel'");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/clm/Work/svelte-a11y-panel
pnpm check 2>&1 | grep -E "error|warning" || echo "No errors"
```

Expected: no TypeScript errors in `src/init/detect.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/init/detect.ts
git commit -m "feat: add CLI project detection utilities"
```

---

## Task 3: Code generation + main CLI script

**Files:**
- Modify: `src/init/codegen.ts`
- Modify: `src/init/index.ts`

- [ ] **Step 1: Write codegen.ts**

```typescript
// src/init/codegen.ts
export interface InitConfig {
  accentColor: string;
  orgName: string;
  email: string;
  assessmentDate: string;
}

function buildPanelMount(cfg: InitConfig): string {
  return `<PanelMount config={{
  accentColor: '${cfg.accentColor}',
  statement: {
    orgName: '${cfg.orgName}',
    email: '${cfg.email}',
    assessmentDate: '${cfg.assessmentDate}',
  }
}} />`;
}

export function injectIntoLayout(existing: string, cfg: InitConfig): string {
  let content = existing;
  const importLine = `  import { PanelMount } from 'svelte-a11y-panel';`;

  if (!content.includes("from 'svelte-a11y-panel'")) {
    if (/<script[\s>]/m.test(content)) {
      content = content.replace(/(<script[^>]*>)/, `$1\n${importLine}`);
    } else {
      content = `<script lang="ts">\n${importLine}\n</script>\n\n` + content;
    }
  }

  const panel = buildPanelMount(cfg);

  if (content.includes('{@render children()}')) {
    content = content.replace('{@render children()}', `${panel}\n\n{@render children()}`);
  } else {
    content = content.trimEnd() + `\n\n${panel}\n`;
  }

  return content;
}

export function createLayout(cfg: InitConfig): string {
  return `<script lang="ts">
  import { PanelMount } from 'svelte-a11y-panel';
  let { children } = $props();
</script>

${buildPanelMount(cfg)}

{@render children()}
`;
}
```

- [ ] **Step 2: Write src/init/index.ts**

```typescript
// src/init/index.ts
import {
  intro, outro, text, confirm, isCancel, cancel, note, spinner,
} from '@clack/prompts';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import {
  isSvelteKitProject, findLayoutPath, readLayoutIfExists, alreadyInstalled,
} from './detect.js';
import { injectIntoLayout, createLayout, type InitConfig } from './codegen.js';

async function main() {
  const cwd = process.cwd();

  intro('svelte-a11y-panel — setup');

  if (!isSvelteKitProject(cwd)) {
    cancel('No svelte.config.js found. Run this from the root of your SvelteKit project.');
    process.exit(1);
  }

  if (alreadyInstalled(cwd)) {
    cancel('svelte-a11y-panel is already present in your layout. Remove it first to re-run setup.');
    process.exit(1);
  }

  const accentColor = await text({
    message: 'Accent colour for overlays and highlights',
    placeholder: '#2563eb',
    defaultValue: '#2563eb',
    validate: (v) =>
      /^#[0-9a-fA-F]{3,8}$/.test(v.trim()) ? undefined : 'Enter a valid hex colour e.g. #2563eb',
  });
  if (isCancel(accentColor)) { cancel('Setup cancelled.'); process.exit(0); }

  const orgName = await text({
    message: 'Organisation name (shown in accessibility statement)',
    placeholder: 'My Organisation',
    defaultValue: '',
  });
  if (isCancel(orgName)) { cancel('Setup cancelled.'); process.exit(0); }

  const email = await text({
    message: 'Accessibility contact email (optional)',
    placeholder: 'accessibility@example.com',
    defaultValue: '',
  });
  if (isCancel(email)) { cancel('Setup cancelled.'); process.exit(0); }

  const assessmentDate = await text({
    message: 'Accessibility statement date',
    placeholder: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
    defaultValue: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
  });
  if (isCancel(assessmentDate)) { cancel('Setup cancelled.'); process.exit(0); }

  const cfg: InitConfig = {
    accentColor: (accentColor as string).trim() || '#2563eb',
    orgName: (orgName as string).trim(),
    email: (email as string).trim(),
    assessmentDate: (assessmentDate as string).trim(),
  };

  const layoutPath = findLayoutPath(cwd);
  const existing = readLayoutIfExists(cwd);
  const verb = existing ? 'Modify' : 'Create';

  const shouldProceed = await confirm({
    message: `${verb} ${layoutPath.replace(cwd + '/', '')} to add PanelMount?`,
  });
  if (isCancel(shouldProceed) || !shouldProceed) { cancel('Setup cancelled.'); process.exit(0); }

  const s = spinner();
  s.start('Writing layout file');

  try {
    const newContent = existing ? injectIntoLayout(existing, cfg) : createLayout(cfg);
    if (!existing) mkdirSync(dirname(layoutPath), { recursive: true });
    writeFileSync(layoutPath, newContent, 'utf-8');
    s.stop('Layout file updated');
  } catch (e) {
    s.stop('Failed');
    cancel(String(e));
    process.exit(1);
  }

  note(
    `Add the trigger button wherever you want to open the panel:\n\n` +
    `  import { AccessibilityButton } from 'svelte-a11y-panel';\n\n` +
    `  <AccessibilityButton />`,
    'Next step'
  );

  outro('All done! Visit https://svelte-a11y-panel.vercel.app for full documentation.');
}

main();
```

- [ ] **Step 3: Build the CLI and verify the output**

```bash
cd /home/clm/Work/svelte-a11y-panel
pnpm build:cli
```

Expected: `bin/init.js` is created, starts with `#!/usr/bin/env node`, file size > 10KB (clack is bundled in).

- [ ] **Step 4: Smoke-test the CLI from a temp directory**

```bash
cd /tmp
mkdir cli-test && cd cli-test
echo '{}' > package.json
touch svelte.config.js
mkdir -p src/routes
# Run the CLI — it should detect the project and prompt
node /home/clm/Work/svelte-a11y-panel/bin/init.js
```

Expected: intro message displays, accent colour prompt appears. Ctrl+C to cancel — should print "Setup cancelled." and exit cleanly.

- [ ] **Step 5: Commit**

```bash
cd /home/clm/Work/svelte-a11y-panel
git add src/init/codegen.ts src/init/index.ts bin/init.js
git commit -m "feat: implement init CLI — interactive setup for SvelteKit projects"
```

---

## Task 4: Vercel adapter + global styles setup

**Files:**
- Modify: `svelte.config.js`
- Modify: `package.json` (add adapter-vercel to devDeps)
- Create: `src/app.css`

- [ ] **Step 1: Install the Vercel adapter**

```bash
cd /home/clm/Work/svelte-a11y-panel
pnpm add -D @sveltejs/adapter-vercel
```

- [ ] **Step 2: Update svelte.config.js**

```javascript
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-vercel';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
};
```

- [ ] **Step 3: Create src/app.css**

```css
/* src/app.css */
*, *::before, *::after { box-sizing: border-box; }

:root {
  --color-bg: #ffffff;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-heading: #0f172a;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-border: #e5e7eb;
  --color-sidebar-bg: #f8fafc;
  --color-code-bg: #1e293b;
  --color-code-text: #e2e8f0;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Cascadia Code', Consolas, monospace;
  --max-width: 1100px;
  --sidebar-width: 240px;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--color-accent); text-decoration: none; }
a:hover { text-decoration: underline; }

h1, h2, h3, h4 {
  color: var(--color-heading);
  line-height: 1.2;
  margin-top: 0;
}

pre {
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 1.25rem 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.7;
  margin: 0;
}

code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: #f1f5f9;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  color: #0f172a;
}

pre code {
  background: none;
  padding: 0;
  color: inherit;
  font-size: inherit;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border: none;
}
.btn-primary {
  background: var(--color-accent);
  color: #fff;
}
.btn-primary:hover { background: var(--color-accent-hover); text-decoration: none; }
.btn-ghost {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn-ghost:hover { background: var(--color-sidebar-bg); text-decoration: none; }
```

- [ ] **Step 4: Import app.css in src/app.html** — add the import link in the head

Actually, in SvelteKit you import global CSS in the root `+layout.svelte` script block. Update `src/routes/+layout.svelte` to import it (this will be fully replaced in Task 5 — for now just verify the adapter works):

```bash
cd /home/clm/Work/svelte-a11y-panel
pnpm check 2>&1 | tail -5
```

Expected: no errors about the adapter import.

- [ ] **Step 5: Commit**

```bash
git add svelte.config.js src/app.css package.json pnpm-lock.yaml
git commit -m "feat: add vercel adapter and global CSS for docs site"
```

---

## Task 5: Site shell layout

**Files:**
- Modify: `src/routes/+layout.svelte`

The root layout wraps every page. It includes:
- Global CSS import
- Top nav (logo + GitHub link)
- `PanelMount` with demo config so the panel runs on the docs site itself
- `{@render children()}`

- [ ] **Step 1: Write src/routes/+layout.svelte**

```svelte
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
```

- [ ] **Step 2: Start dev server and verify the header appears**

```bash
cd /home/clm/Work/svelte-a11y-panel
pnpm dev
```

Open `http://localhost:5173` — should see the sticky header with logo and nav links. The accessibility panel should be reachable (you won't see the button yet — that's in the next task).

- [ ] **Step 3: Commit**

```bash
git add src/routes/+layout.svelte
git commit -m "feat: add site shell layout with sticky nav and PanelMount"
```

---

## Task 6: Home page

**Files:**
- Modify: `src/routes/+page.svelte`

The home page has four sections:
1. **Hero** — tagline, one-liner, install command, two CTA buttons (Docs, GitHub)
2. **Features grid** — six feature cards
3. **Quick start code** — the two-line install with syntax-highlighted snippet
4. **Footer** — MIT license, GitHub link

The accessibility button (to actually open the panel on the demo site) lives in the hero.

- [ ] **Step 1: Write src/routes/+page.svelte**

```svelte
<script lang="ts">
  import { AccessibilityButton } from '$lib';
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
        <p class="demo-label">Try it live — this site runs it:</p>
        <AccessibilityButton label="Open accessibility panel" />
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
      <p class="section-sub">Add to your root layout. That's it — no CSS, no config files, no build plugins.</p>
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

<script lang="ts" context="module">
  // This is a module-level block in the same component
</script>

<script lang="ts">
  const FEATURES = [
    { icon: '🛡️', title: 'Shadow DOM isolated', desc: 'Panel CSS is fully isolated — it cannot affect your site\'s styles.' },
    { icon: '⚡', title: 'Zero runtime deps', desc: 'The published package includes only its own code. Nothing extra installed.' },
    { icon: '🎨', title: 'Fully configurable', desc: 'Brand colours, fonts, org name, contact email — all configurable.' },
    { icon: '♿', title: '20+ features', desc: 'Profiles, contrast modes, font overrides, TTS, voice nav, virtual keyboard, and more.' },
    { icon: '🔒', title: 'Security audited', desc: 'CSS injection protection, localStorage schema validation, CSP documented.' },
    { icon: '📦', title: 'TypeScript ready', desc: 'Full type exports for A11yPanelConfig, PanelState, and all public APIs.' },
  ];
</script>

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
  .features {
    padding: 4rem 1.5rem;
  }
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
  .quickstart-inner {
    max-width: 680px;
    margin: 0 auto;
  }
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
```

**Note:** Svelte 5 components cannot have two `<script>` blocks of the same type. Remove the empty `context="module"` block above — it was accidentally included. The `FEATURES` constant belongs in the first `<script lang="ts">` block alongside the `AccessibilityButton` import. Here is the corrected single script block:

```svelte
<script lang="ts">
  import { AccessibilityButton } from '$lib';

  const FEATURES = [
    { icon: '🛡️', title: 'Shadow DOM isolated', desc: "Panel CSS is fully isolated — it cannot affect your site's styles." },
    { icon: '⚡', title: 'Zero runtime deps', desc: 'The published package includes only its own code. Nothing extra installed.' },
    { icon: '🎨', title: 'Fully configurable', desc: 'Brand colours, fonts, org name, contact email — all configurable.' },
    { icon: '♿', title: '20+ features', desc: 'Profiles, contrast modes, font overrides, TTS, voice nav, virtual keyboard, and more.' },
    { icon: '🔒', title: 'Security audited', desc: 'CSS injection protection, localStorage schema validation, CSP documented.' },
    { icon: '📦', title: 'TypeScript ready', desc: 'Full type exports for A11yPanelConfig, PanelState, and all public APIs.' },
  ];
</script>
```

Use this single block. Remove the `context="module"` block entirely.

- [ ] **Step 2: Verify in the browser**

```bash
pnpm dev
```

Open `http://localhost:5173`. Expected: hero section with title, subtitle, two CTA buttons, the `AccessibilityButton` in the hero, features grid, and quick start code blocks.

- [ ] **Step 3: Commit**

```bash
git add src/routes/+page.svelte
git commit -m "feat: add home page with hero, features grid, and quick start"
```

---

## Task 7: Docs page layout and sidebar

**Files:**
- Create: `src/routes/docs/+layout.svelte`
- Create: `src/routes/docs/+page.svelte` (skeleton only — content added in Tasks 8–9)

The docs layout has a sticky left sidebar with anchor links and a main content area. All docs live on a single `/docs` page (sections separated by `id` anchors).

- [ ] **Step 1: Create src/routes/docs/+layout.svelte**

```svelte
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

<svelte:head>
  <title>Docs — svelte-a11y-panel</title>
</svelte:head>

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
</style>
```

- [ ] **Step 2: Create skeleton src/routes/docs/+page.svelte**

```svelte
<svelte:head>
  <title>Docs — svelte-a11y-panel</title>
  <meta name="description" content="Full documentation for svelte-a11y-panel — installation, configuration, init CLI, CSP, theming, and more." />
</svelte:head>

<h1>Documentation</h1>
<p>Content coming in the next tasks.</p>
```

- [ ] **Step 3: Verify in the browser**

```bash
pnpm dev
```

Open `http://localhost:5173/docs`. Expected: sidebar on the left with nav links, "Documentation" heading in the content area.

- [ ] **Step 4: Commit**

```bash
git add src/routes/docs/
git commit -m "feat: add docs layout with sidebar navigation"
```

---

## Task 8: Docs content — Installation, Quick Start, Configuration

**Files:**
- Modify: `src/routes/docs/+page.svelte`

Replace the skeleton with the first three sections. Use `id` attributes on each section heading for anchor navigation.

- [ ] **Step 1: Write the Installation, Quick Start, and Configuration sections**

Replace `src/routes/docs/+page.svelte` with:

```svelte
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
  <p><code>PanelMount</code> renders nothing visible — it sets up the panel in a Shadow DOM appended to <code>document.body</code>. <code>AccessibilityButton</code> is a minimal unstyled button that opens and closes the panel. You can put it anywhere in your layout.</p>
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
        <tr><td><code>dyslexiaFontUrl</code></td><td><code>string</code></td><td>jsDelivr CDN</td><td>WOFF2 URL for the OpenDyslexic font. Override to self-host.</td></tr>
        <tr><td><code>storageKey</code></td><td><code>string</code></td><td><code>'a11y-panel-state'</code></td><td><code>localStorage</code> key for persisted state</td></tr>
        <tr><td><code>positionKey</code></td><td><code>string</code></td><td><code>'a11y-panel-pos'</code></td><td><code>sessionStorage</code> key for dragged panel position</td></tr>
        <tr><td><code>statement.orgName</code></td><td><code>string</code></td><td><code>''</code></td><td>Organisation name in the accessibility statement</td></tr>
        <tr><td><code>statement.email</code></td><td><code>string</code></td><td><code>''</code></td><td>Contact email in the accessibility statement</td></tr>
        <tr><td><code>statement.conformanceStatus</code></td><td><code>string</code></td><td>WCAG 2.1 AA string</td><td>Conformance statement text</td></tr>
        <tr><td><code>statement.limitations</code></td><td><code>string[]</code></td><td><code>[]</code></td><td>Known accessibility limitations to list</td></tr>
        <tr><td><code>statement.assessmentDate</code></td><td><code>string</code></td><td><code>''</code></td><td>Date the accessibility statement was prepared</td></tr>
      </tbody>
    </table>
  </div>

  <h3>Security note</h3>
  <p>
    <code>accentColor</code> and <code>dyslexiaFontUrl</code> are interpolated into a CSS stylesheet
    injected into the host page. Do not set these from untrusted user input or unvalidated CMS fields.
    Treat config as a build-time constant.
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
```

- [ ] **Step 2: Verify in browser**

Open `http://localhost:5173/docs`. Expected: three sections with correct content, table renders, code blocks styled, sidebar anchor links navigate to sections.

- [ ] **Step 3: Commit**

```bash
git add src/routes/docs/+page.svelte
git commit -m "feat: add docs installation, quick start, and configuration sections"
```

---

## Task 9: Docs content — Init CLI, Theming, Custom Statement, Custom Trigger, CSP, Host Effects

**Files:**
- Modify: `src/routes/docs/+page.svelte`

Append the remaining sections to the docs page (after the Configuration section, before the closing `<style>` block).

- [ ] **Step 1: Add Init CLI section**

Append inside `src/routes/docs/+page.svelte`, before `<style>`:

```svelte
<!-- Init CLI -->
<section id="init-cli" class="doc-section">
  <h2>Init CLI</h2>
  <p>If you'd prefer a guided setup, run the init command from the root of your SvelteKit project:</p>
  <pre><code>npx svelte-a11y-panel init</code></pre>
  <p>The CLI will:</p>
  <ul>
    <li>Detect your SvelteKit project</li>
    <li>Ask for your accent colour, org name, contact email, and statement date</li>
    <li>Modify (or create) <code>src/routes/+layout.svelte</code> with the configured <code>PanelMount</code></li>
    <li>Show you the next step (adding <code>AccessibilityButton</code>)</li>
  </ul>
  <p>The CLI only runs when you invoke it — it is not a <code>postinstall</code> hook and never runs automatically.</p>
</section>

<!-- Theming -->
<section id="theming" class="doc-section">
  <h2>Theming</h2>
  <p>
    The panel renders inside a Shadow DOM, so your page's CSS cannot reach it.
    You can override the panel's fonts via CSS custom properties on <code>:root</code>:
  </p>
  <pre><code>/* In your global CSS */
:root &#123;
  --a11y-font-ui:    'Your Body Font', sans-serif;
  --a11y-font-title: 'Your Heading Font', sans-serif;
&#125;</code></pre>
  <p>
    The panel's accent colour (buttons, toggles, focus rings inside the panel UI) is set via
    <code>accentColor</code> in the config — not via CSS custom properties.
  </p>
</section>

<!-- Custom statement -->
<section id="custom-statement" class="doc-section">
  <h2>Custom accessibility statement</h2>
  <p>To fully replace the default statement content, pass a <code>customStatement</code> snippet to <code>PanelMount</code>:</p>
  <pre><code>&lt;PanelMount config=&#123;myConfig&#125;&gt;
  &#123;#snippet customStatement()&#125;
    &lt;h2&gt;Our Accessibility Statement&lt;/h2&gt;
    &lt;p&gt;We are committed to making our site accessible to everyone.&lt;/p&gt;
    &lt;p&gt;
      Contact us at
      &lt;a href="mailto:access@example.com"&gt;access@example.com&lt;/a&gt;.
    &lt;/p&gt;
  &#123;/snippet&#125;
&lt;/PanelMount&gt;</code></pre>
  <p>
    When <code>customStatement</code> is provided, the default statement (org name, conformance status,
    limitations, date) is replaced entirely. The back button and header are still rendered.
    If you only need to set org name, email, and date — use the <code>statement</code> config fields instead.
  </p>
</section>

<!-- Custom trigger -->
<section id="custom-trigger" class="doc-section">
  <h2>Custom trigger button</h2>
  <p>
    <code>AccessibilityButton</code> is intentionally minimal — a plain <code>&lt;button&gt;</code> with an
    SVG icon and correct ARIA attributes. If you want to style your own trigger, use the state functions directly:
  </p>
  <pre><code>&lt;script&gt;
  import &#123; openPanel, closePanel, getOpen &#125; from 'svelte-a11y-panel';
&lt;/script&gt;

&lt;button
  onclick=&#123;() =&gt; getOpen() ? closePanel() : openPanel()&#125;
  aria-expanded=&#123;getOpen()&#125;
  aria-controls="a11y-panel"
&gt;
  Accessibility settings
&lt;/button&gt;</code></pre>
  <p>
    <code>getOpen()</code> is a reactive getter backed by a Svelte 5 <code>$state</code> — it returns
    the current open state and re-runs any <code>$derived</code> or template that reads it.
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
        <tr><td>Self-hosted font</td><td><code>font-src 'self'</code> — set <code>dyslexiaFontUrl</code> to your own URL</td></tr>
      </tbody>
    </table>
  </div>
  <p>
    If <code>style-src 'unsafe-inline'</code> is blocked, the panel UI still works but host-page
    effects (font overrides, contrast filters, cursor changes) will be silent no-ops.
  </p>

  <h3>Microphone access</h3>
  <p>
    Voice navigation uses <code>window.SpeechRecognition</code>, which requests
    <strong>microphone permission</strong> from the user the first time it is enabled.
    Speech is processed entirely in the browser — no audio is sent to any server by this library.
    You may want to mention microphone use in your privacy policy if you enable this feature.
  </p>

  <h3>localStorage</h3>
  <p>
    The user's accessibility preferences (toggle states, font size, colour overrides) are persisted
    to <code>localStorage</code>. No personally identifiable information is stored.
  </p>

  <h3>CDN font</h3>
  <p>
    When dyslexia mode is enabled, a request is made to <code>cdn.jsdelivr.net</code> for the
    OpenDyslexic font. To avoid this, provide your own font URL via <code>dyslexiaFontUrl</code>.
  </p>
</section>

<!-- Host page effects -->
<section id="host-effects" class="doc-section">
  <h2>Host page effects</h2>
  <p>
    When users enable accessibility features, the library actively manipulates the host page.
    This is intentional — it is the only way to apply accessibility adjustments across the entire site.
  </p>
  <div class="table-wrap">
    <table>
      <thead><tr><th>Effect</th><th>What it does</th></tr></thead>
      <tbody>
        <tr><td>Style injection</td><td>Injects <code>&lt;style id="a11y-panel-host-styles"&gt;</code> into <code>&lt;head&gt;</code> with CSS for fonts, contrast, cursors, focus rings</td></tr>
        <tr><td>Reading guide / mask</td><td>Appends overlay <code>&lt;div&gt;</code>s to <code>&lt;body&gt;</code></td></tr>
        <tr><td>Text magnifier</td><td>Appends a magnifier <code>&lt;div&gt;</code> that follows the cursor</td></tr>
        <tr><td>Link navigator</td><td>Appends a <code>&lt;dialog&gt;</code> listing all <code>a[href]</code> elements on the page</td></tr>
        <tr><td>Virtual keyboard</td><td>Appends a keyboard <code>&lt;div&gt;</code>; dispatches synthetic <code>KeyboardEvent</code>s to focused inputs</td></tr>
        <tr><td>Text-to-speech</td><td>Attaches a click listener to <code>document</code>; uses <code>window.speechSynthesis</code></td></tr>
        <tr><td>Voice navigation</td><td>Uses <code>window.SpeechRecognition</code>; calls <code>window.scrollBy</code>, <code>history.back()</code>, <code>window.location.href</code></td></tr>
        <tr><td>Navigation keys</td><td>Attaches a <code>keydown</code> listener to <code>document</code>; focuses headings / buttons / inputs on H / B / F keypresses</td></tr>
        <tr><td>Mute sounds</td><td>Sets <code>muted = true</code> on all <code>&lt;audio&gt;</code> and <code>&lt;video&gt;</code> elements</td></tr>
        <tr><td>Hide emoji</td><td>Wraps emoji text nodes in <code>&lt;span&gt;</code>s with a hidden class</td></tr>
      </tbody>
    </table>
  </div>
  <p>All effects are fully reversed when the user turns them off or the panel is unmounted.</p>
</section>
```

- [ ] **Step 2: Verify all sections render in browser**

Open `http://localhost:5173/docs` and scroll through all sections. Click each sidebar link to verify anchor navigation works. Check that tables and code blocks render correctly.

- [ ] **Step 3: Commit**

```bash
git add src/routes/docs/+page.svelte
git commit -m "feat: add remaining docs sections — init CLI, theming, CSP, host effects"
```

---

## Task 10: Update README

**Files:**
- Modify: `README.md`

Add the docs site URL and the init CLI command near the top of the README so GitHub visitors can find them immediately.

- [ ] **Step 1: Add docs site and init CLI to README**

After the `## Requirements` section and before `## Installation`, insert:

```markdown
## Documentation

Full docs and live demo: **https://svelte-a11y-panel.vercel.app**

```

After the `## Quick start` section, add:

```markdown
## Setup CLI (optional)

Prefer a guided setup? Run from the root of your SvelteKit project:

```bash
npx svelte-a11y-panel init
```

The CLI detects your layout file and adds a configured `PanelMount` with your brand colour, org name, and contact email pre-filled.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add docs site URL and init CLI section to README"
```

---

## Task 11: Vercel deployment

**Files:**
- No new files required — the adapter is already configured in Task 4.

- [ ] **Step 1: Push everything to GitHub**

```bash
cd /home/clm/Work/svelte-a11y-panel
git push
```

- [ ] **Step 2: Create Vercel project**

In the Vercel dashboard (vercel.com):
1. Click "Add New → Project"
2. Import the `curtislmartin/svelte-a11y-panel` GitHub repo
3. Framework preset: **SvelteKit** (Vercel auto-detects)
4. Build command: `pnpm build` (default — runs `vite build`)
5. Output directory: leave blank (SvelteKit adapter handles this)
6. Click "Deploy"

- [ ] **Step 3: Verify the deployed site**

Once the deploy completes, open the Vercel URL (e.g. `svelte-a11y-panel.vercel.app`). Expected:
- Home page loads with hero and features grid
- Accessibility button in the hero opens the panel
- `/docs` loads with sidebar and all sections
- Anchor links in sidebar navigate correctly

- [ ] **Step 4: (Optional) Add custom subdomain**

In Vercel project settings → Domains → add your custom subdomain (e.g. `a11y.curtismartin.dev` or `svelte-a11y-panel.vercel.app` is fine as-is).

- [ ] **Step 5: Update the outro in src/init/index.ts to use the real URL**

Once you have the final URL, update line in `src/init/index.ts`:
```typescript
outro('All done! Visit https://svelte-a11y-panel.vercel.app for full documentation.');
```

Rebuild the CLI:
```bash
pnpm build:cli
git add bin/init.js src/init/index.ts
git commit -m "chore: update init CLI outro URL to deployed docs site"
git push
```

---

## Self-Review

**Spec coverage:**

| Requirement | Covered by |
|---|---|
| Zero-dep install | Library untouched — no new runtime deps |
| Optional `npx init` CLI | Tasks 1–3 |
| Interactive prompts (like create-svelte) | Task 3 — @clack/prompts bundled into bin/init.js |
| Detects existing layout, injects PanelMount | Task 2 (detect.ts) + Task 3 (codegen.ts + index.ts) |
| Docs site with live demo | Tasks 5–9 |
| Panel running on the docs site itself | Task 5 (PanelMount in root layout) |
| Installation section | Task 8 |
| Configuration API reference | Task 8 |
| Init CLI docs | Task 9 |
| CSP & privacy docs | Task 9 |
| Theming docs | Task 9 |
| Custom statement docs | Task 9 |
| Custom trigger docs | Task 9 |
| Host page effects explanation | Task 9 |
| Deployed to Vercel | Task 11 |
| README updated | Task 10 |

**Placeholder scan:** No TBDs. All code blocks contain complete implementations.

**Type consistency:** `InitConfig` is defined in `codegen.ts` and imported in `index.ts`. `detect.ts` exports are used in `index.ts` with `.js` extension (required for ESM Node). The `$lib` alias in route components maps to `src/lib/` via the vite config alias — `import { PanelMount, AccessibilityButton } from '$lib'` is correct.
