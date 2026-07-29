# Contributing to svelte-a11y-panel

Bug reports, feature ideas, and pull requests are all welcome. Here's what you need to know.

## Getting started

You'll need Node 18+ and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/curtislmartin/svelte-a11y-panel.git
cd svelte-a11y-panel
pnpm install
pnpm dev
```

`pnpm dev` runs the docs site, which doubles as the development playground. The panel is mounted there, so you can try your changes against a real page.

The library source lives in `src/lib`; the docs site lives in `src/routes`.

## Before opening a PR

Please run:

```bash
pnpm check      # svelte-check / type checking
pnpm test       # unit tests (vitest)
pnpm test:e2e   # end-to-end tests (playwright)
pnpm lint       # formatting (prettier)
```

If you're adding behaviour, add or update a test alongside it.

**Don't commit changes to `dist/`.** It's built output and gets rebuilt as part of the release process. If your build touched it, leave those files out of your PR.

## Filing issues

Bug reports are most useful with:

- What you did, what you expected, what happened instead
- Your Svelte / SvelteKit versions and browser
- A minimal reproduction if you can manage one

Feature ideas are welcome too. For anything substantial, please open an issue to discuss it before writing a big PR, so the direction is agreed first.

## Pull requests

- Keep PRs small and focused on one change.
- Describe the user-facing effect in the PR description, not just the code change.
- Work in progress is fine; open it as a draft.

## Accessibility requirements

This is an accessibility tool, so contributions are held to that standard:

- **Panel UI must be keyboard-operable.** Anything you add to the panel needs to be reachable and usable with the keyboard alone, with visible focus.
- **Label controls for screen readers.** New buttons, toggles, and sliders need accessible names (and state, where relevant).
- **Respect the existing config surface.** New effects should be toggleable via config like everything else, and work with profiles and config sanitisation.
- **Test with the panel itself.** Before submitting, try your change with the panel's own features turned on: keyboard navigation, stop animations, high contrast. Your feature needs to work under the tool's own settings.

## Questions

Not sure about something? Open an issue and ask.
