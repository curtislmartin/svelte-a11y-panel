import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'src/tests/e2e',
  webServer: {
    command: 'pnpm dev --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:5174',
  },
});
