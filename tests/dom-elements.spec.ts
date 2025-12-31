import { test, expect } from '@playwright/test';

test.describe('DOM Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('countdown container exists', async ({ page }) => {
    await expect(page.locator('#countdown-container')).toBeVisible();
  });

  test('all time display elements exist', async ({ page }) => {
    await expect(page.locator('#days')).toBeVisible();
    await expect(page.locator('#hours')).toBeVisible();
    await expect(page.locator('#minutes')).toBeVisible();
    await expect(page.locator('#seconds')).toBeVisible();
  });

  test('celebration element exists but is hidden', async ({ page }) => {
    const celebration = page.locator('#celebration');
    await expect(celebration).toBeAttached();
    await expect(celebration).not.toBeVisible();
  });

  test('fireworks canvas exists', async ({ page }) => {
    await expect(page.locator('#fireworks-canvas')).toBeAttached();
  });

  test('giant countdown element exists', async ({ page }) => {
    await expect(page.locator('#giant-countdown')).toBeAttached();
  });

  test('dramatic overlay exists', async ({ page }) => {
    await expect(page.locator('#dramatic-overlay')).toBeAttached();
  });

  test('dev panel exists but is hidden', async ({ page }) => {
    const devPanel = page.locator('#dev-panel');
    await expect(devPanel).toBeAttached();
    await expect(devPanel).not.toBeVisible();
  });

  test('aurora element exists', async ({ page }) => {
    await expect(page.locator('.aurora')).toBeVisible();
  });

  test('mountains element exists', async ({ page }) => {
    await expect(page.locator('.mountains')).toBeVisible();
  });

  test('snowflakes container has snowflakes', async ({ page }) => {
    const snowflakes = page.locator('#snowflakes .snowflake');
    await expect(snowflakes.first()).toBeAttached();
    const count = await snowflakes.count();
    expect(count).toBeGreaterThan(10);
  });

  test('stars container has stars', async ({ page }) => {
    const stars = page.locator('#stars .star');
    await expect(stars.first()).toBeAttached();
    const count = await stars.count();
    expect(count).toBeGreaterThan(50);
  });

  test('ski decorations exist', async ({ page, isMobile }) => {
    // Ski decorations are hidden on mobile
    if (isMobile) {
      await expect(page.locator('.ski-decor.ski-left')).toBeAttached();
      await expect(page.locator('.ski-decor.ski-right')).toBeAttached();
    } else {
      await expect(page.locator('.ski-decor.ski-left')).toBeVisible();
      await expect(page.locator('.ski-decor.ski-right')).toBeVisible();
    }
  });

  test('Åre sign exists', async ({ page }) => {
    await expect(page.locator('.are-sign')).toBeVisible();
    await expect(page.locator('.are-sign')).toContainText('Åreskutan');
  });

  test('logo contains #NyÅreKlockan branding', async ({ page }) => {
    await expect(page.locator('.logo')).toContainText('ÅRE');
  });

  test('train countdown exists', async ({ page }) => {
    await expect(page.locator('#train-countdown')).toBeAttached();
    await expect(page.locator('.train-title')).toContainText('Tåget');
  });
});
