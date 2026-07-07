# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: panel.spec.ts >> accessibility statement shows configured org name
- Location: src/tests/e2e/panel.spec.ts:93:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "Demo App"
Received: "svelte-a11y-panel demo"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - button "Accessibility options" [expanded] [ref=e2] [cursor=pointer]:
    - img [ref=e3]
  - banner [ref=e7]:
    - generic [ref=e8]:
      - link "svelte-a11y-panel" [ref=e9] [cursor=pointer]:
        - /url: /
        - img [ref=e11]
        - generic [ref=e15]: svelte-a11y-panel
      - navigation "Site navigation" [ref=e16]:
        - link "Docs" [ref=e17] [cursor=pointer]:
          - /url: /docs
        - link "GitHub" [ref=e18] [cursor=pointer]:
          - /url: https://github.com/curtislmartin/svelte-a11y-panel
        - button "Switch to dark mode" [ref=e19] [cursor=pointer]:
          - img [ref=e20]
  - main [ref=e22]:
    - generic [ref=e24]:
      - generic [ref=e25]: Svelte 5 · Zero runtime deps · MIT
      - heading "Accessibility panel for Svelte 5" [level=1] [ref=e26]:
        - text: Accessibility panel
        - text: for Svelte 5
      - paragraph [ref=e27]: Lets visitors adjust your site for their needs — contrast, fonts, cursors, TTS, voice nav, and more. Drops into any SvelteKit project in two lines. No CSS required.
      - generic [ref=e28]:
        - link "Get started" [ref=e29] [cursor=pointer]:
          - /url: /docs
        - link "View on GitHub" [ref=e30] [cursor=pointer]:
          - /url: https://github.com/curtislmartin/svelte-a11y-panel
      - paragraph [ref=e32]: Try it live — tap the button floating in the bottom right ↘
    - generic [ref=e34]:
      - heading "Everything your users need" [level=2] [ref=e35]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - generic [ref=e38]: 🛡️
          - heading "Shadow DOM isolated" [level=3] [ref=e39]
          - paragraph [ref=e40]: Panel CSS is fully isolated — it cannot affect your site's styles.
        - generic [ref=e41]:
          - generic [ref=e42]: ⚡
          - heading "Zero runtime deps" [level=3] [ref=e43]
          - paragraph [ref=e44]: The published package includes only its own code. Nothing extra installed.
        - generic [ref=e45]:
          - generic [ref=e46]: 🎨
          - heading "Fully configurable" [level=3] [ref=e47]
          - paragraph [ref=e48]: Brand colours, fonts, org name, contact email — all configurable.
        - generic [ref=e49]:
          - generic [ref=e50]: ♿
          - heading "20+ features" [level=3] [ref=e51]
          - paragraph [ref=e52]: Profiles, contrast modes, font overrides, TTS, voice nav, virtual keyboard, and more.
        - generic [ref=e53]:
          - generic [ref=e54]: 🔒
          - heading "Security audited" [level=3] [ref=e55]
          - paragraph [ref=e56]: CSS injection protection, localStorage schema validation, CSP documented.
        - generic [ref=e57]:
          - generic [ref=e58]: 📦
          - heading "TypeScript ready" [level=3] [ref=e59]
          - paragraph [ref=e60]: Full type exports for A11yPanelConfig, PanelState, and all public APIs.
    - generic [ref=e62]:
      - heading "Two lines to install" [level=2] [ref=e63]
      - paragraph [ref=e64]: Add to your root layout. No CSS, no config files, no build plugins.
      - generic [ref=e65]:
        - generic [ref=e66]: Terminal
        - code [ref=e68]: pnpm add svelte-a11y-panel
      - generic [ref=e69]:
        - generic [ref=e70]: src/routes/+layout.svelte
        - code [ref=e72]: "<script> import { PanelMount, AccessibilityButton } from 'svelte-a11y-panel'; let { children } = $props(); </script> <PanelMount config={{ accentColor: '#2563eb' }} /> <AccessibilityButton /> {@render children()}"
      - generic [ref=e73]:
        - link "Read the docs" [ref=e74] [cursor=pointer]:
          - /url: /docs
        - link "Or use the setup CLI →" [ref=e75] [cursor=pointer]:
          - /url: /docs#init-cli
  - contentinfo [ref=e76]:
    - generic [ref=e77]:
      - generic [ref=e78]: MIT License · Built by Curtis Martin
      - link "GitHub" [ref=e79] [cursor=pointer]:
        - /url: https://github.com/curtislmartin/svelte-a11y-panel
  - dialog [ref=e81]:
    - generic [ref=e82]:
      - generic [ref=e92]: Accessibility Settings
      - button [ref=e93] [cursor=pointer]: ✕
    - generic [ref=e94]:
      - generic [ref=e95]:
        - button [ref=e96] [cursor=pointer]:
          - img [ref=e97]
          - text: Back
        - generic [ref=e99]: Accessibility Statement
      - generic [ref=e100]:
        - paragraph [ref=e101]: svelte-a11y-panel demo
        - paragraph [ref=e102]: We are committed to ensuring digital accessibility for people with disabilities.
        - heading [level=3] [ref=e103]: Conformance status
        - paragraph [ref=e104]:
          - text: We aim to conform to WCAG 2.1 Level AA. See
          - link [ref=e105] [cursor=pointer]:
            - /url: https://www.w3.org/TR/WCAG21/
            - text: WCAG 2.1
          - text: .
        - heading [level=3] [ref=e106]: Technical specifications
        - paragraph [ref=e107]: This website relies on HTML, CSS, JavaScript, and WAI-ARIA for conformance.
        - heading [level=3] [ref=e108]: Feedback
        - paragraph [ref=e109]:
          - text: Contact us at
          - link [ref=e110] [cursor=pointer]:
            - /url: mailto:curtislmartin2008@gmail.com
            - text: curtislmartin2008@gmail.com
          - text: .
        - heading [level=3] [ref=e111]: Assessment approach
        - paragraph [ref=e112]: Self-evaluation. Statement prepared April 2026.
```

# Test source

```ts
  7   |   }, { timeout: 5000 });
  8   | }
  9   | 
  10  | async function waitForPanelClose(page: import('@playwright/test').Page) {
  11  |   await page.waitForFunction(() => {
  12  |     const host = document.querySelector('[data-a11y-panel-host]');
  13  |     return host?.shadowRoot?.querySelector('#a11y-panel')?.getAttribute('aria-hidden') === 'true';
  14  |   }, { timeout: 3000 });
  15  | }
  16  | 
  17  | test.beforeEach(async ({ page }) => {
  18  |   await page.goto('/');
  19  |   await page.waitForLoadState('networkidle');
  20  | });
  21  | 
  22  | test('trigger button is present and labelled', async ({ page }) => {
  23  |   const trigger = page.getByRole('button', { name: 'Accessibility options' });
  24  |   await expect(trigger).toBeVisible();
  25  |   await expect(trigger).toHaveAttribute('aria-controls', 'a11y-panel');
  26  |   await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  27  | });
  28  | 
  29  | test('panel opens on trigger click', async ({ page }) => {
  30  |   await page.getByRole('button', { name: 'Accessibility options' }).click();
  31  |   await waitForPanelOpen(page);
  32  |   await expect(page.getByRole('button', { name: 'Accessibility options' })).toHaveAttribute('aria-expanded', 'true');
  33  | });
  34  | 
  35  | test('panel closes on second trigger click', async ({ page }) => {
  36  |   const trigger = page.getByRole('button', { name: 'Accessibility options' });
  37  |   await trigger.click();
  38  |   await waitForPanelOpen(page);
  39  |   await trigger.click();
  40  |   await waitForPanelClose(page);
  41  |   await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  42  | });
  43  | 
  44  | test('panel closes on Escape', async ({ page }) => {
  45  |   await page.getByRole('button', { name: 'Accessibility options' }).click();
  46  |   await waitForPanelOpen(page);
  47  |   await page.keyboard.press('Escape');
  48  |   await waitForPanelClose(page);
  49  | });
  50  | 
  51  | test('focus returns to trigger after Escape', async ({ page }) => {
  52  |   const trigger = page.getByRole('button', { name: 'Accessibility options' });
  53  |   await trigger.click();
  54  |   await waitForPanelOpen(page);
  55  |   await page.keyboard.press('Escape');
  56  |   await waitForPanelClose(page);
  57  |   await expect(trigger).toBeFocused();
  58  | });
  59  | 
  60  | test('panel closes via header close button', async ({ page }) => {
  61  |   await page.getByRole('button', { name: 'Accessibility options' }).click();
  62  |   await waitForPanelOpen(page);
  63  |   await page.evaluate(() => {
  64  |     const host = document.querySelector('[data-a11y-panel-host]');
  65  |     (host?.shadowRoot?.querySelector('.a11y-header__close') as HTMLElement)?.click();
  66  |   });
  67  |   await waitForPanelClose(page);
  68  | });
  69  | 
  70  | test('enabling dark contrast injects style tag into document.head', async ({ page }) => {
  71  |   await page.getByRole('button', { name: 'Accessibility options' }).click();
  72  |   await waitForPanelOpen(page);
  73  |   // Open Visual section accordion
  74  |   await page.evaluate(() => {
  75  |     const host = document.querySelector('[data-a11y-panel-host]');
  76  |     const triggers = host?.shadowRoot?.querySelectorAll('.accordion__trigger');
  77  |     const visual = Array.from(triggers ?? []).find(b => b.textContent?.toUpperCase().includes('VISUALLY'));
  78  |     (visual as HTMLElement)?.click();
  79  |   });
  80  |   await page.waitForTimeout(200);
  81  |   // Click Dark Contrast chip
  82  |   await page.evaluate(() => {
  83  |     const host = document.querySelector('[data-a11y-panel-host]');
  84  |     const chips = host?.shadowRoot?.querySelectorAll('.contrast-chip');
  85  |     const dark = Array.from(chips ?? []).find(c => c.textContent?.includes('Dark'));
  86  |     (dark as HTMLElement)?.click();
  87  |   });
  88  |   await page.waitForTimeout(300);
  89  |   const hasStyleTag = await page.evaluate(() => !!document.getElementById('a11y-panel-host-styles'));
  90  |   expect(hasStyleTag).toBe(true);
  91  | });
  92  | 
  93  | test('accessibility statement shows configured org name', async ({ page }) => {
  94  |   await page.getByRole('button', { name: 'Accessibility options' }).click();
  95  |   await waitForPanelOpen(page);
  96  |   await page.evaluate(() => {
  97  |     const host = document.querySelector('[data-a11y-panel-host]');
  98  |     const btns = host?.shadowRoot?.querySelectorAll('.a11y-footer__btn');
  99  |     const stmt = Array.from(btns ?? []).find(b => b.textContent?.includes('Statement'));
  100 |     (stmt as HTMLElement)?.click();
  101 |   });
  102 |   await page.waitForTimeout(200);
  103 |   const orgName = await page.evaluate(() => {
  104 |     const host = document.querySelector('[data-a11y-panel-host]');
  105 |     return host?.shadowRoot?.querySelector('.statement-org')?.textContent;
  106 |   });
> 107 |   expect(orgName).toBe('Demo App');
      |                   ^ Error: expect(received).toBe(expected) // Object.is equality
  108 | });
  109 | 
  110 | test('state persists to localStorage', async ({ page }) => {
  111 |   await page.getByRole('button', { name: 'Accessibility options' }).click();
  112 |   await waitForPanelOpen(page);
  113 |   // Open Readable section
  114 |   await page.evaluate(() => {
  115 |     const host = document.querySelector('[data-a11y-panel-host]');
  116 |     const triggers = host?.shadowRoot?.querySelectorAll('.accordion__trigger');
  117 |     const readable = Array.from(triggers ?? []).find(b => b.textContent?.toUpperCase().includes('READABLE'));
  118 |     (readable as HTMLElement)?.click();
  119 |   });
  120 |   await page.waitForTimeout(200);
  121 |   // Toggle Readable Font
  122 |   await page.evaluate(() => {
  123 |     const host = document.querySelector('[data-a11y-panel-host]');
  124 |     const switches = host?.shadowRoot?.querySelectorAll('[role=switch]');
  125 |     const font = Array.from(switches ?? []).find(s => s.getAttribute('aria-label')?.includes('Readable'));
  126 |     (font as HTMLElement)?.click();
  127 |   });
  128 |   await page.waitForTimeout(500);
  129 |   const stored = await page.evaluate(() => localStorage.getItem('a11y-panel-state'));
  130 |   expect(stored).toBeTruthy();
  131 |   expect(JSON.parse(stored!).readableFont).toBe(true);
  132 | });
  133 | 
```