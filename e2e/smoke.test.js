import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
    test('should display the home page with manifesto', async ({ page }) => {
        await page.goto('/');

        // Check for the main title or branding
        await expect(page.locator('h1')).toContainText(/UBATEXAS/i);

        // Header navigation links (Title Case after our recent fix)
        await expect(page.getByRole('link', { name: 'Agenda', exact: true })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Gente', exact: true })).toBeVisible();
    });

    test('navigation to Gente gallery works', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('link', { name: 'Gente', exact: true }).click();

        await expect(page).toHaveURL(/\/gente/);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(/Gente/i);
    });
});
