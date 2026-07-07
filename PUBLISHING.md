# Publishing to npm

## Prerequisites

- npm account at npmjs.com
- Write access to the `svelte-a11y-panel` package

## Steps

### 1. Build the package

```bash
pnpm build:all
```

Runs `tsup` (CLI) then `svelte-package` (library). Produces `dist/` and `bin/`.

### 2. Log in to npm

```bash
npm login
```

Prompts for username, password, and email. Opens a browser for 2FA if enabled.

### 3. Dry run

```bash
npm publish --dry-run
```

Shows exactly what files will be published (controlled by `"files"` in `package.json` — currently `["dist", "bin"]`). Confirm nothing sensitive is included.

### 4. Publish

```bash
npm publish --access public
```

`--access public` is required on the first publish.

### 5. Verify

```bash
npm info svelte-a11y-panel
```

Should show version `0.1.0` after a moment.

---

## Publishing a beta

If you want to publish without making it the default install:

```bash
npm publish --access public --tag beta
```

Users install it with `npm install svelte-a11y-panel@beta`. Promote to latest when ready:

```bash
npm dist-tag add svelte-a11y-panel@0.1.0 latest
```

---

## Releasing a new version

1. Bump the version in `package.json`
2. Commit: `git commit -m "chore: bump version to x.x.x"`
3. Tag: `git tag vx.x.x`
4. Push: `git push && git push --tags`
5. Run steps 1 → 4 above
