import { test, expect } from '@playwright/test';

test('เข้าหน้าเว็ปไซต์ Alumni', async ({ page }) => {
  await page.goto('https://alumni.sck.co.th/');

  // await page.getByRole('link', { name: 'Get started' }).click();

  // await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
