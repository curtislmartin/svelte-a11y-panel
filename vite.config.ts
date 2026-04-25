import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => ({
  plugins: mode === 'test'
    ? [svelte(), svelteTesting()]
    : [sveltekit()],
  resolve: {
    alias: {
      $lib: path.resolve(__dirname, 'src/lib'),
    },
  },
  test: {
    include: ['src/tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    globals: true,
  },
}));
