import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/tests/unit/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    globals: true,
  },
});
