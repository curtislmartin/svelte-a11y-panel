import { test, expect } from '@playwright/test';

async function waitForPanelOpen(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    return host?.shadowRoot?.querySelector('#a11y-panel')?.getAttribute('aria-hidden') === 'false';
  }, { timeout: 5000 });
}

async function waitForPanelClose(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    return host?.shadowRoot?.querySelector('#a11y-panel')?.getAttribute('aria-hidden') === 'true';
  }, { timeout: 3000 });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test('trigger button is present and labelled', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Accessibility options' });
  await expect(trigger).toBeVisible();
  await expect(trigger).toHaveAttribute('aria-controls', 'a11y-panel');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('panel opens on trigger click', async ({ page }) => {
  await page.getByRole('button', { name: 'Accessibility options' }).click();
  await waitForPanelOpen(page);
  await expect(page.getByRole('button', { name: 'Accessibility options' })).toHaveAttribute('aria-expanded', 'true');
});

test('panel closes on second trigger click', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Accessibility options' });
  await trigger.click();
  await waitForPanelOpen(page);
  await trigger.click();
  await waitForPanelClose(page);
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('panel closes on Escape', async ({ page }) => {
  await page.getByRole('button', { name: 'Accessibility options' }).click();
  await waitForPanelOpen(page);
  await page.keyboard.press('Escape');
  await waitForPanelClose(page);
});

test('focus returns to trigger after Escape', async ({ page }) => {
  const trigger = page.getByRole('button', { name: 'Accessibility options' });
  await trigger.click();
  await waitForPanelOpen(page);
  await page.keyboard.press('Escape');
  await waitForPanelClose(page);
  await expect(trigger).toBeFocused();
});

test('panel closes via header close button', async ({ page }) => {
  await page.getByRole('button', { name: 'Accessibility options' }).click();
  await waitForPanelOpen(page);
  await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    (host?.shadowRoot?.querySelector('.a11y-header__close') as HTMLElement)?.click();
  });
  await waitForPanelClose(page);
});

test('enabling dark contrast injects style tag into document.head', async ({ page }) => {
  await page.getByRole('button', { name: 'Accessibility options' }).click();
  await waitForPanelOpen(page);
  // Open Visual section accordion
  await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    const triggers = host?.shadowRoot?.querySelectorAll('.accordion__trigger');
    const visual = Array.from(triggers ?? []).find(b => b.textContent?.toUpperCase().includes('VISUALLY'));
    (visual as HTMLElement)?.click();
  });
  await page.waitForTimeout(200);
  // Click Dark Contrast chip
  await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    const chips = host?.shadowRoot?.querySelectorAll('.contrast-chip');
    const dark = Array.from(chips ?? []).find(c => c.textContent?.includes('Dark'));
    (dark as HTMLElement)?.click();
  });
  await page.waitForTimeout(300);
  const hasStyleTag = await page.evaluate(() => !!document.getElementById('a11y-panel-host-styles'));
  expect(hasStyleTag).toBe(true);
});

test('accessibility statement shows configured org name', async ({ page }) => {
  await page.getByRole('button', { name: 'Accessibility options' }).click();
  await waitForPanelOpen(page);
  await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    const btns = host?.shadowRoot?.querySelectorAll('.a11y-footer__btn');
    const stmt = Array.from(btns ?? []).find(b => b.textContent?.includes('Statement'));
    (stmt as HTMLElement)?.click();
  });
  await page.waitForTimeout(200);
  const orgName = await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    return host?.shadowRoot?.querySelector('.statement-org')?.textContent;
  });
  expect(orgName).toBe('svelte-a11y-panel demo');
});

test('state persists to localStorage', async ({ page }) => {
  await page.getByRole('button', { name: 'Accessibility options' }).click();
  await waitForPanelOpen(page);
  // Open Readable section
  await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    const triggers = host?.shadowRoot?.querySelectorAll('.accordion__trigger');
    const readable = Array.from(triggers ?? []).find(b => b.textContent?.toUpperCase().includes('READABLE'));
    (readable as HTMLElement)?.click();
  });
  await page.waitForTimeout(200);
  // Toggle Readable Font
  await page.evaluate(() => {
    const host = document.querySelector('[data-a11y-panel-host]');
    const switches = host?.shadowRoot?.querySelectorAll('[role=switch]');
    const font = Array.from(switches ?? []).find(s => s.getAttribute('aria-label')?.includes('Readable'));
    (font as HTMLElement)?.click();
  });
  await page.waitForTimeout(500);
  const stored = await page.evaluate(() => localStorage.getItem('a11y-panel-state'));
  expect(stored).toBeTruthy();
  expect(JSON.parse(stored!).readableFont).toBe(true);
});
