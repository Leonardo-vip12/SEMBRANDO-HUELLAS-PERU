import { test, expect } from '@playwright/test';

test.describe('Sembrando Huellas Perú — E2E Smoke Tests', () => {
  test('Home page loads successfully with correct title and elements', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Sembrando Huellas/i);
    
    // Check main navigation header exists
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('Projects / Programs page is accessible', async ({ page }) => {
    await page.goto('/programas');
    await expect(page.locator('body')).toBeVisible();
  });

  test('Environmental Intelligence Suite (EIS) page renders', async ({ page }) => {
    await page.goto('/eis');
    await expect(page.locator('body')).toBeVisible();
  });

  test('SIA Environmental Information System page renders', async ({ page }) => {
    await page.goto('/sia');
    await expect(page.locator('body')).toBeVisible();
  });
});
