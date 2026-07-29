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

  intro('svelte-a11y-panel setup');

  if (!isSvelteKitProject(cwd)) {
    cancel('No svelte.config.js found. Run this from the root of your SvelteKit project.');
    process.exit(1);
  }

  if (alreadyInstalled(cwd)) {
    cancel("svelte-a11y-panel is already present in your layout. Remove it first to re-run setup.");
    process.exit(1);
  }

  const accentColor = await text({
    message: 'Accent colour for overlays and highlights',
    placeholder: '#2563eb',
    defaultValue: '#2563eb',
    validate: (v) =>
      /^#[0-9a-fA-F]{3,8}$/.test((v ?? '').trim()) ? undefined : 'Enter a valid hex colour e.g. #2563eb',
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

  outro('All done! Visit https://a11y.clmartin.dev for full documentation.');
}

main();
