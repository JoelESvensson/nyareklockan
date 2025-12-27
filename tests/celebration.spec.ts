import { test, expect } from '@playwright/test';

test.describe('Celebration Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('celebration element exists in DOM', async ({ page }) => {
    await expect(page.locator('#celebration')).toBeAttached();
  });

  test('celebration is hidden initially', async ({ page }) => {
    await expect(page.locator('#celebration')).not.toHaveClass(/active/);
  });

  test('fireworks canvas element exists', async ({ page }) => {
    await expect(page.locator('#fireworks-canvas')).toBeAttached();
  });

  test('celebration text elements exist', async ({ page }) => {
    await expect(page.locator('#celebration h1')).toBeAttached();
    const h1Text = await page.locator('#celebration h1').textContent();
    expect(h1Text).toContain('GOTT NYTT ÅR');
  });

  test('celebration includes year 2026', async ({ page }) => {
    const celebrationText = await page.locator('#celebration .celebration-text').textContent();
    expect(celebrationText).toContain('2026');
  });

  test('celebration includes ski emojis', async ({ page }) => {
    const emojiRow = await page.locator('#celebration .emoji-row').textContent();
    expect(emojiRow).toContain('🎿');
  });
});

// Test celebration activation using dev panel (reliable method)
test.describe('Celebration Activation via Dev Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test.afterEach(async ({ page }) => {
    // Clean up
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = null;
      (window as any).resetDramaticEffects();
      try { (window as any).stopFireworks(); } catch(e) {}
    }).catch(() => {});
  });

  test('celebration activates via dev panel preset', async ({ page }) => {
    // Open dev panel
    await page.click('#dev-toggle');
    await page.waitForTimeout(200);
    
    // Select celebration preset
    await page.selectOption('#dev-time-preset', '0');
    await page.waitForTimeout(500);
    
    // Celebration should be active
    await expect(page.locator('#celebration')).toHaveClass(/active/);
  });

  test('celebration hides main container', async ({ page }) => {
    // Open dev panel
    await page.click('#dev-toggle');
    await page.waitForTimeout(200);
    
    // Select celebration preset
    await page.selectOption('#dev-time-preset', '0');
    await page.waitForTimeout(500);
    
    // Main container should be hidden
    const display = await page.locator('.container').evaluate(el => getComputedStyle(el).display);
    expect(display).toBe('none');
  });

  test('reset from celebration restores normal state', async ({ page }) => {
    // Open dev panel and trigger celebration
    await page.click('#dev-toggle');
    await page.waitForTimeout(200);
    await page.selectOption('#dev-time-preset', '0');
    await page.waitForTimeout(500);
    
    // Verify celebration is active
    await expect(page.locator('#celebration')).toHaveClass(/active/);
    
    // Reset
    await page.click('#dev-reset');
    await page.waitForTimeout(500);
    
    // Celebration should be hidden
    await expect(page.locator('#celebration')).not.toHaveClass(/active/);
  });
});
