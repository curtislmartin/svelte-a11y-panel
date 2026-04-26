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
