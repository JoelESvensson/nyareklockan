import { test, expect } from '@playwright/test';

test.describe('Countdown Logic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('countdown displays valid 2-digit numbers', async ({ page }) => {
    const days = await page.locator('#days').textContent();
    const hours = await page.locator('#hours').textContent();
    const minutes = await page.locator('#minutes').textContent();
    const seconds = await page.locator('#seconds').textContent();

    expect(days).toMatch(/^\d{2}$/);
    expect(hours).toMatch(/^\d{2}$/);
    expect(minutes).toMatch(/^\d{2}$/);
    expect(seconds).toMatch(/^\d{2}$/);
  });

  test('seconds value changes over time', async ({ page }) => {
    const initialSeconds = await page.locator('#seconds').textContent();
    await page.waitForTimeout(1100);
    const newSeconds = await page.locator('#seconds').textContent();
    
    // Seconds should have changed (unless it wrapped from 00 to 59)
    expect(initialSeconds !== newSeconds || initialSeconds === '00').toBeTruthy();
  });

  test('getDistance function is exposed', async ({ page }) => {
    const hasFunction = await page.evaluate(() => {
      return typeof (window as any).getDistance === 'function';
    });
    expect(hasFunction).toBe(true);
  });

  test('updateCountdown function is exposed', async ({ page }) => {
    const hasFunction = await page.evaluate(() => {
      return typeof (window as any).updateCountdown === 'function';
    });
    expect(hasFunction).toBe(true);
  });

  test('dev simulation can modify distance', async ({ page }) => {
    const originalDistance = await page.evaluate(() => {
      return (window as any).getDistance();
    });

    await page.evaluate(() => {
      (window as any).devSimulatedDistance = 300000; // 5 minutes
    });

    const simulatedDistance = await page.evaluate(() => {
      return (window as any).getDistance();
    });

    expect(simulatedDistance).toBe(300000);

    // Reset
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = null;
    });
  });
});
