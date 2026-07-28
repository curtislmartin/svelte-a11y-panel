# svelte-a11y-panel

A configurable, open-source accessibility panel for Svelte 5 apps. Lets users adjust your site for their needs without any server-side setup.

Originally built for Care Culture's public website, then extracted into a standalone package.

## What it does

Adds an accessibility widget that lets site visitors adjust your site for their needs:

- **Profiles:** Epilepsy Safe, Low Vision, Cognitive, ADHD, Blindness
- **Readable Experience:** font size, line height, letter spacing, readable/dyslexia fonts, text magnifier
- **Visual:** dark/high contrast, monochrome, saturation, custom colour overrides
- **Orientation:** reading guide, reading mask, hide images/emoji, stop animations, cursor size, focus/hover highlights
- **Cognitive:** text-to-speech, voice navigation, keyboard shortcuts, link navigator, virtual keyboard

The panel UI renders in a **Shadow DOM**, isolating its styles from your site's CSS.

> **Note:** The accessibility effects actively reach into your page (injecting CSS, appending overlays, muting audio). That is the point. See [Host page effects](#host-page-effects) below.

## Documentation

Full docs and live demo: **https://a11y.clmartin.dev**

## Requirements

- Svelte **5** (runes)
- SvelteKit **2+** (or a Vite project)
- Node **18+**

## Installation

```bash
pnpm add svelte-a11y-panel
# or
npm install svelte-a11y-panel
```

## Quick start

Add `PanelMount` and `AccessibilityButton` to your root layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { PanelMount, AccessibilityButton } from 'svelte-a11y-panel';
  let { children } = $props();
</script>

<PanelMount config={{
  accentColor: '#2563eb',
  statement: {
    orgName: 'Your Organisation',
    email: 'accessibility@yoursite.com',
    assessmentDate: 'January 2026',
  }
}} />

<AccessibilityButton accentColor="#2563eb" />

{@render children()}
```

`PanelMount` renders nothing visible. It sets up the panel in a Shadow DOM. `AccessibilityButton` is a fixed-position floating button (bottom-right) that opens and closes the panel.

## Setup CLI (optional)

Prefer a guided setup? Run from the root of your SvelteKit project:

```bash
npx svelte-a11y-panel init
```

The CLI detects your layout file and adds a configured `PanelMount` with your brand colour, org name, and contact email pre-filled.

## Configuration

Pass a config object to `PanelMount`:

```svelte
<PanelMount config={myConfig} />
```

| Option | Type | Default | Description |
|---|---|---|---|
| `accentColor` | `string` | `'#2563eb'` | Colour for buttons, toggles, focus rings, and host-page overlays |
| `uiFontFamily` | `string` | `'system-ui, sans-serif'` | Font for the panel UI and all overlays |
| `dyslexiaFontUrl` | `string` | jsDelivr CDN | WOFF2 URL for the OpenDyslexic font |
| `storageKey` | `string` | `'a11y-panel-state'` | `localStorage` key for persisted state |
| `positionKey` | `string` | `'a11y-panel-pos'` | `sessionStorage` key for dragged panel position |
| `statement.orgName` | `string` | `''` | Organisation name in accessibility statement |
| `statement.email` | `string` | `''` | Contact email in accessibility statement |
| `statement.conformanceStatus` | `string` | `''` | Optional conformance statement text |
| `statement.limitations` | `string[]` | `[]` | Known limitations to list |
| `statement.assessmentDate` | `string` | `''` | Date string for the statement |

### Security note

Config values (`accentColor`, `dyslexiaFontUrl`) are interpolated into a CSS stylesheet injected into the Shadow DOM. Do not set these from untrusted user input or unvalidated CMS fields. Treat config as a build-time constant, not a runtime user setting.

## Theming the panel

The panel renders inside a Shadow DOM, so your page's CSS (including custom properties on `:root`) cannot reach it. Theming is done through config:

- **Accent colour:** `accentColor` controls buttons, toggles, focus rings, and overlays.
- **Font:** `uiFontFamily` controls the panel UI and all overlays.

```svelte
<PanelMount config={{
  accentColor: '#7c3aed',
  uiFontFamily: "'Inter', system-ui, sans-serif",
}} />
```

## AccessibilityButton props

| Prop | Type | Default | Description |
|---|---|---|---|
| `accentColor` | `string` | `'#2563eb'` | Background colour of the button |
| `label` | `string` | `'Accessibility options'` | Accessible label for screen readers |
| `class` | `string` | `''` | Additional CSS classes |

## Custom trigger button

`AccessibilityButton` is intentionally simple. Build your own trigger using the state functions directly:

```svelte
<script>
  import { openPanel, closePanel, getOpen } from 'svelte-a11y-panel';
  let buttonEl = $state(null);
</script>

<button
  bind:this={buttonEl}
  onclick={() => getOpen() ? closePanel() : openPanel(buttonEl)}
  aria-expanded={getOpen()}
  aria-controls="a11y-panel"
  aria-label="Accessibility options"
>
  Accessibility settings
</button>
```

`openPanel(element)` takes your trigger element so the panel can return focus to it when closed. `getOpen()` is a reactive getter backed by Svelte 5 `$state`.

## Host page effects

When users enable features, the panel actively modifies your page:

| Feature | What it does to your page |
|---|---|
| Font size / contrast / filters | Injects `<style id="a11y-panel-host-styles">` into `<head>` |
| Reading guide / mask / magnifier | Appends overlay `<div>`s to `<body>` |
| Mute sounds | Sets `.muted = true` on all `<audio>` and `<video>` elements |
| Hide emoji | Wraps emoji text nodes in `<span data-a11y-panel-emoji>` |
| Link navigator | Appends a `<dialog>` to `<body>` |
| Virtual keyboard | Appends a keyboard `<div>` to `<body>`, dispatches synthetic `KeyboardEvent`s |
| Text-to-speech | Attaches a `click` listener to `document`, uses `window.speechSynthesis` |
| Voice navigation | Uses `window.SpeechRecognition`, calls `window.scrollBy` / `history` |
| Navigation keys | Attaches a `keydown` listener to `document` |
| State persistence | Saves to `localStorage` under `config.storageKey` |

The panel removes its injected styles, overlays, and event listeners when the relevant setting is turned off or the panel is unmounted.

## Browser support

| Feature | Support |
|---|---|
| Panel UI | Current Chrome, Edge, Firefox, and Safari |
| Text-to-speech | Current Chrome, Edge, Firefox, and Safari |
| Voice navigation | Chrome, Edge, and Safari (Web Speech API; not Firefox) |
| Virtual keyboard | Current Chrome, Edge, Firefox, and Safari |

## Custom accessibility statement

Pass a `customStatement` snippet to `PanelMount` to replace the default statement content entirely:

```svelte
<PanelMount config={myConfig}>
  {#snippet customStatement()}
    <h2>Our Accessibility Statement</h2>
    <p>We are committed to making our site accessible to everyone.</p>
    <p>Contact us at <a href="mailto:access@example.com">access@example.com</a>.</p>
  {/snippet}
</PanelMount>
```

When `customStatement` is provided, the default statement is replaced entirely by your content. The back button and statement header are still rendered.

## Content Security Policy (CSP)

If your site uses a strict CSP, you will need to allow the following:

| Feature | CSP directive required |
|---|---|
| Host-page style injection | `style-src 'unsafe-inline'` (or a nonce) |
| OpenDyslexic font (if using dyslexia mode) | `font-src cdn.jsdelivr.net` |
| Self-hosted font | `font-src 'self'` (set `dyslexiaFontUrl` to your own URL) |

If `'unsafe-inline'` is blocked, the panel UI still works. Host-page style overrides such as font changes, contrast filters, and cursor overrides will be silent no-ops.

## Privacy and permissions

**Voice navigation** uses the browser's `SpeechRecognition` API, which requires **microphone permission**. The browser will prompt the user the first time they enable voice navigation. The library does not record or transmit audio itself, but the browser's speech-recognition service may send captured audio to a remote server. Chrome, for example, may use Google's servers for recognition.

**Text-to-speech** reads aloud the text content of any element the user clicks. On pages with sensitive information, users should be aware that reading aloud may expose content to bystanders.

**localStorage** stores the user's accessibility preferences (toggle states, font size, colours). The panel does not intentionally store names, email addresses, or account identifiers.

**CDN font:** When dyslexia mode is enabled, a request is made to `cdn.jsdelivr.net`. To avoid this, provide your own font URL via `dyslexiaFontUrl`.

## License

MIT — see [LICENSE](./LICENSE)
