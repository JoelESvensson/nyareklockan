import { test, expect } from '@playwright/test';

test.describe('Dramatic Mode Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Reset to clean state
    await page.evaluate(() => {
      (window as any).resetDramaticEffects();
      (window as any).devSimulatedDistance = null;
    });
  });

  test.afterEach(async ({ page }) => {
    // Clean up
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = null;
      (window as any).resetDramaticEffects();
    });
  });

  test('10-minute mode activates with correct classes', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 300000; // 5 minutes
      (window as any).devCountdownActive = false;
      (window as any).updateCountdown();
    });

    await page.waitForTimeout(200);

    const dramaticMode = await page.evaluate(() => (window as any).dramaticMode);
    expect(dramaticMode).toBe('10min');

    await expect(page.locator('body')).toHaveClass(/dramatic-10min/);
    await expect(page.locator('#dramatic-overlay')).toHaveClass(/active-10min/);
  });

  test('seconds turn orange in 10-minute mode', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 300000;
      (window as any).devCountdownActive = false;
      (window as any).updateCountdown();
    });

    await page.waitForTimeout(200);

    const color = await page.locator('#seconds').evaluate(el => {
      return getComputedStyle(el).color;
    });

    // Should be orange (rgb(255, 153, 0))
    expect(color).toBe('rgb(255, 153, 0)');
  });

  test('1-minute mode activates with correct classes', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 30000; // 30 seconds
      (window as any).devCountdownActive = false;
      (window as any).updateCountdown();
    });

    await page.waitForTimeout(200);

    const dramaticMode = await page.evaluate(() => (window as any).dramaticMode);
    expect(dramaticMode).toBe('1min');

    await expect(page.locator('body')).toHaveClass(/dramatic-1min/);
    await expect(page.locator('#countdown-container')).toHaveClass(/shake/);
    await expect(page.locator('#countdown-container')).toHaveClass(/urgent/);
  });

  test('seconds turn red in 1-minute mode', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 30000;
      (window as any).devCountdownActive = false;
      (window as any).updateCountdown();
    });

    await page.waitForTimeout(200);

    const color = await page.locator('#seconds').evaluate(el => {
      return getComputedStyle(el).color;
    });

    // Should be red (rgb(255, 0, 0))
    expect(color).toBe('rgb(255, 0, 0)');
  });

  test('final countdown mode shows giant numbers', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 5000; // 5 seconds
      (window as any).devCountdownActive = false;
      (window as any).lastGiantNumber = -1;
      (window as any).updateCountdown();
    });

    await page.waitForTimeout(300);

    const dramaticMode = await page.evaluate(() => (window as any).dramaticMode);
    expect(dramaticMode).toBe('final');

    await expect(page.locator('#giant-countdown')).toHaveClass(/visible/);
    
    const number = await page.locator('#giant-countdown').textContent();
    expect(number).toMatch(/^\d+$/);
  });

  test('final countdown retains 1-minute mode effects', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 5000;
      (window as any).devCountdownActive = false;
      (window as any).updateCountdown();
    });

    await page.waitForTimeout(200);

    // Should still have the 1-minute dramatic effects
    await expect(page.locator('body')).toHaveClass(/dramatic-1min/);
    await expect(page.locator('#countdown-container')).toHaveClass(/shake/);
  });

  test('year display updates based on time remaining', async ({ page }) => {
    // Normal mode (> 10 min)
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 700000;
      (window as any).devCountdownActive = false;
      (window as any).updateCountdown();
    });
    await page.waitForTimeout(100);
    let yearText = await page.locator('#year-display').textContent();
    expect(yearText).toContain('⏰');

    // 10 min mode
    await page.evaluate(() => {
      (window as any).resetDramaticEffects();
      (window as any).devSimulatedDistance = 300000;
      (window as any).updateCountdown();
    });
    await page.waitForTimeout(100);
    yearText = await page.locator('#year-display').textContent();
    expect(yearText).toContain('SNART');

    // 1 min mode
    await page.evaluate(() => {
      (window as any).resetDramaticEffects();
      (window as any).devSimulatedDistance = 30000;
      (window as any).updateCountdown();
    });
    await page.waitForTimeout(100);
    yearText = await page.locator('#year-display').textContent();
    expect(yearText).toContain('NU');
  });
});
