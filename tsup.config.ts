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
