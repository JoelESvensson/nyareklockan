import { test, expect } from '@playwright/test';

test.describe('Dev Mode Panel', () => {
  // Skip dev mode tests on mobile - dev panel is hidden on small screens
  test.skip(({ isMobile }) => isMobile, 'Dev panel not available on mobile');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    // Clean up - reset everything
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = null;
      (window as any).devCountdownActive = false;
      (window as any).resetDramaticEffects();
      (window as any).stopFireworks();
    });
  });

  test('dev mode toggle button exists', async ({ page }) => {
    await expect(page.locator('#dev-toggle')).toBeVisible();
    await expect(page.locator('#dev-toggle')).toHaveText('DEV');
  });

  test('clicking toggle shows dev panel', async ({ page }) => {
    await page.click('#dev-toggle');
    await expect(page.locator('#dev-panel')).toHaveClass(/visible/);
  });

  test('clicking toggle again hides dev panel', async ({ page }) => {
    // Show panel using button
    await page.click('#dev-toggle');
    await page.waitForTimeout(200);
    await expect(page.locator('#dev-panel')).toHaveClass(/visible/);
    
    // Hide panel using keyboard (button is covered by panel)
    await page.keyboard.press('d');
    await page.waitForTimeout(200);
    await expect(page.locator('#dev-panel')).not.toHaveClass(/visible/);
  });

  test('dev panel has preset dropdown', async ({ page }) => {
    await page.click('#dev-toggle');
    
    await expect(page.locator('#dev-time-preset')).toBeVisible();
    
    // Check some options exist
    const options = await page.locator('#dev-time-preset option').allTextContents();
    expect(options.join(' ')).toContain('11');
    expect(options.join(' ')).toContain('5 minutes');
    expect(options.join(' ')).toContain('Celebration');
  });

  test('selecting 11+ minutes preset sets normal mode', async ({ page }) => {
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '700000');
    
    await page.waitForTimeout(300);
    
    const mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('normal');
  });

  test('selecting 5 minutes preset sets 10min mode', async ({ page }) => {
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '300000');
    
    await page.waitForTimeout(300);
    
    const mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('10min');
    
    await expect(page.locator('body')).toHaveClass(/dramatic-10min/);
  });

  test('selecting 30 seconds preset sets 1min mode', async ({ page }) => {
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '30000');
    
    await page.waitForTimeout(300);
    
    const mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('1min');
    
    await expect(page.locator('body')).toHaveClass(/dramatic-1min/);
  });

  test('selecting 10 seconds preset sets final mode', async ({ page }) => {
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '10000');
    
    await page.waitForTimeout(300);
    
    const mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('final');
    
    await expect(page.locator('#giant-countdown')).toHaveClass(/visible/);
  });

  test('selecting celebration preset triggers celebration', async ({ page }) => {
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '0');
    
    await page.waitForTimeout(500);
    
    await expect(page.locator('#celebration')).toHaveClass(/active/);
  });

  test('reset button restores normal state', async ({ page }) => {
    // First set to dramatic mode
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '30000');
    await page.waitForTimeout(300);
    
    await expect(page.locator('body')).toHaveClass(/dramatic-1min/);
    
    // Now reset
    await page.click('#dev-reset');
    await page.waitForTimeout(300);
    
    const simulated = await page.evaluate(() => (window as any).devSimulatedDistance);
    expect(simulated).toBeNull();
  });

  test('keyboard shortcut D toggles dev panel', async ({ page }) => {
    // Panel should be hidden initially
    await expect(page.locator('#dev-panel')).not.toHaveClass(/visible/);
    
    // Press D to show
    await page.keyboard.press('d');
    await expect(page.locator('#dev-panel')).toHaveClass(/visible/);
    
    // Press D again to hide
    await page.keyboard.press('d');
    await expect(page.locator('#dev-panel')).not.toHaveClass(/visible/);
  });

  test('custom time input works', async ({ page }) => {
    await page.click('#dev-toggle');
    
    await page.fill('#dev-custom-time', '45');
    await page.click('#dev-apply-custom');
    
    await page.waitForTimeout(500);
    
    const simulated = await page.evaluate(() => (window as any).devSimulatedDistance);
    // Should be around 45 seconds (44-45 seconds due to tick)
    expect(simulated).toBeLessThanOrEqual(45000);
    expect(simulated).toBeGreaterThanOrEqual(43000);
  });

  test('dev panel shows current status', async ({ page }) => {
    await page.click('#dev-toggle');
    await page.selectOption('#dev-time-preset', '300000');
    
    await page.waitForTimeout(300);
    
    const modeDisplay = await page.locator('#dev-mode-display').textContent();
    expect(modeDisplay).toBe('10min');
    
    const simulatedDisplay = await page.locator('#dev-simulated').textContent();
    expect(simulatedDisplay).toBe('Yes');
  });
});

test.describe('Dev Mode Visual Indicators', () => {
  test.skip(({ isMobile }) => isMobile, 'Dev panel not available on mobile');

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }) => {
    await page.evaluate(() => {
      (window as any).devSimulatedDistance = null;
      (window as any).resetDramaticEffects();
    });
  });

  test('multiple mode transitions work correctly', async ({ page }) => {
    await page.click('#dev-toggle');
    
    // Start at 11 min (normal)
    await page.selectOption('#dev-time-preset', '700000');
    await page.waitForTimeout(200);
    let mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('normal');
    
    // Go to 5 min (10min mode)
    await page.selectOption('#dev-time-preset', '300000');
    await page.waitForTimeout(200);
    mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('10min');
    
    // Go to 30 sec (1min mode)
    await page.selectOption('#dev-time-preset', '30000');
    await page.waitForTimeout(200);
    mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('1min');
    
    // Go to 10 sec (final mode)
    await page.selectOption('#dev-time-preset', '10000');
    await page.waitForTimeout(200);
    mode = await page.evaluate(() => (window as any).dramaticMode);
    expect(mode).toBe('final');
    
    // Go to celebration
    await page.selectOption('#dev-time-preset', '0');
    await page.waitForTimeout(500);
    await expect(page.locator('#celebration')).toHaveClass(/active/);
    
    // Reset back
    await page.click('#dev-reset');
    await page.waitForTimeout(200);
    const simulated = await page.evaluate(() => (window as any).devSimulatedDistance);
    expect(simulated).toBeNull();
  });
});
