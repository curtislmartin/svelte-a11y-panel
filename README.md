# svelte-a11y-panel

A configurable, open-source accessibility panel for Svelte 5 apps. Lets users adjust your site for their needs without any server-side setup.

## What it does

Adds an accessibility widget that lets site visitors adjust your site for their needs:

- **Profiles:** Epilepsy Safe, Low Vision, Cognitive, ADHD, Blindness
- **Readable Experience:** font size, line height, letter spacing, readable/dyslexia fonts, text magnifier
- **Visual:** dark/high contrast, monochrome, saturation, custom colour overrides
- **Orientation:** reading guide, reading mask, hide images/emoji, stop animations, cursor size, focus/hover highlights
- **Cognitive:** text-to-speech, voice navigation, keyboard shortcuts, link navigator, virtual keyboard

The panel UI renders in a **Shadow DOM** — fully isolated from your site's CSS.

> **Note:** The accessibility effects actively reach into your page (injecting CSS, appending overlays, muting audio). That is the point. See [Host page effects](#host-page-effects) below.

## Requirements

- Svelte **5** (runes)
- A SvelteKit (or Vite) project

## Installation

```bash
pnpm add svelte-a11y-panel
# or
npm install svelte-a11y-panel
```

## Quick start

Add `PanelMount` to your root layout and place `AccessibilityButton` wherever you want the trigger:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { PanelMount, AccessibilityButton } from 'svelte-a11y-panel';
  let { children } = $props();
</script>

<PanelMount config={{
  statement: {
    orgName: 'Your Organisation',
    email: 'accessibility@yoursite.com',
    assessmentDate: 'January 2026',
  }
}} />

<AccessibilityButton />

{@render children()}
```

`PanelMount` renders nothing visible — it just sets up the panel. The button opens and closes it.

## Configuration

Pass a config object to `PanelMount`:

```svelte
<PanelMount config={myConfig} />
```

| Option | Type | Default | Description |
|---|---|---|---|
| `storageKey` | `string` | `'a11y-panel-state'` | `localStorage` key for persisted state |
| `positionKey` | `string` | `'a11y-panel-pos'` | `sessionStorage` key for dragged panel position |
| `accentColor` | `string` | `'#2563eb'` | Colour used for host-page overlays and highlights |
| `uiFontFamily` | `string` | `'system-ui, sans-serif'` | Font for overlays (link navigator, virtual keyboard) |
| `dyslexiaFontUrl` | `string` | jsDelivr CDN | WOFF2 URL for the OpenDyslexic font |
| `statement.orgName` | `string` | `''` | Organisation name in accessibility statement |
| `statement.email` | `string` | `''` | Contact email in accessibility statement |
| `statement.conformanceStatus` | `string` | WCAG 2.1 AA string | Conformance statement text |
| `statement.limitations` | `string[]` | `[]` | Known limitations to list |
| `statement.assessmentDate` | `string` | `''` | Date string for the statement |

### Security note

Config values (`accentColor`, `dyslexiaFontUrl`) are interpolated into a CSS stylesheet injected into the host page. Do not set these from untrusted user input or unvalidated CMS fields. The library validates and sanitises all values before use, but defence-in-depth means you should treat config as a build-time constant, not a runtime user setting.

## Theming the panel UI

The panel renders inside a Shadow DOM. Override these CSS custom properties on `:root` to change its fonts:

```css
:root {
  --a11y-font-ui:    'Your Body Font', sans-serif;
  --a11y-font-title: 'Your Heading Font', sans-serif;
}
```

## Custom trigger button

`AccessibilityButton` is intentionally minimal. Build your own trigger by using the state functions directly:

```svelte
<script>
  import { openPanel, closePanel, getOpen } from 'svelte-a11y-panel';
  let btn = $state(null);
</script>

<button
  bind:this={btn}
  onclick={() => getOpen() ? closePanel() : openPanel(btn)}
  aria-expanded={getOpen()}
  aria-controls="a11y-panel"
  aria-label="Accessibility options"
>
  ♿ Accessibility
</button>
```

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

All effects are cleaned up when the panel unmounts.

## Browser support

| Feature | Support |
|---|---|
| Panel UI | All modern browsers |
| Text-to-speech | All modern browsers |
| Voice navigation | Chrome / Edge only (Web Speech Recognition API) |
| Virtual keyboard | All modern browsers |

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

When `customStatement` is provided, the default statement (org name, conformance status, limitations, etc.) is replaced entirely by your content. The back button and statement header are still rendered.

## Content Security Policy (CSP)

If your site uses a strict CSP, you will need to allow the following:

| Feature | CSP directive required |
|---|---|
| Host-page style injection | `style-src 'unsafe-inline'` (or a nonce) |
| OpenDyslexic font (if using dyslexia mode) | `font-src cdn.jsdelivr.net` |
| Self-hosted font | `font-src 'self'` (set `dyslexiaFontUrl` to your own URL) |

**Recommendation:** If your CSP does not allow `'unsafe-inline'` styles, host the font yourself via `dyslexiaFontUrl` and be aware that the host-page CSS injection feature will be blocked by the browser. The panel UI itself will still work — only the host-page style overrides (font changes, contrast filters, cursor overrides, etc.) will be silent no-ops.

The dynamic import of the panel component requires `script-src` to permit the bundle's origin (typically `'self'`).

## Privacy and permissions

**Voice navigation** uses the browser's `SpeechRecognition` API, which requires **microphone permission**. The browser will prompt the user the first time they enable voice navigation. Speech is processed entirely in the browser — no audio data is sent to any server by this library.

**Text-to-speech** reads aloud the text content of any element the user clicks on the host page. On pages containing sensitive information (account data, medical records), users should be aware that reading aloud may expose content to bystanders.

**localStorage** stores the user's accessibility preferences (toggle states, font size, colours) in the browser. No personally identifiable information is stored.

**CDN font:** When the OpenDyslexic font is loaded, a request is made to `cdn.jsdelivr.net`. To avoid this, provide your own font URL via `dyslexiaFontUrl`.

## License

MIT — see [LICENSE](./LICENSE)
