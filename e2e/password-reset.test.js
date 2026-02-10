import { test, expect } from '@playwright/test';

test.describe('Password Reset Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Start from the login page
        await page.goto('/login');
    });

    test('should display forgot password form when clicking forgot password link', async ({ page }) => {
        // Click on "Forgot Password" link
        await page.getByText(/olvidaste tu contraseña/i).click();

        // Should show email input and updated title
        await expect(page.getByRole('heading', { name: /recuperar contraseña/i })).toBeVisible();
        await expect(page.getByLabel(/email/i)).toBeVisible();
        await expect(page.getByRole('button', { name: /enviar enlace/i })).toBeVisible();
    });

    test('should show success message after requesting password reset', async ({ page }) => {
        // Click on "Forgot Password" link
        await page.getByText(/olvidaste tu contraseña/i).click();

        // Fill in email
        await page.getByLabel(/email/i).fill('test@example.com');

        // Submit the form
        await page.getByRole('button', { name: /enviar enlace/i }).click();

        // Should show success message
        await expect(page.getByText(/se ha enviado un correo/i)).toBeVisible();
    });

    test('should allow returning to login from forgot password', async ({ page }) => {
        // Click on "Forgot Password" link
        await page.getByText(/olvidaste tu contraseña/i).click();

        // Click on "Back to login" link
        await page.getByText(/volver al inicio de sesión/i).click();

        // Should be back on login form
        await expect(page.getByRole('heading', { name: /bienvenido de nuevo/i })).toBeVisible();
        await expect(page.getByLabel('Contraseña', { exact: true })).toBeVisible();
    });

    test('should validate email format on forgot password form', async ({ page }) => {
        // Click on "Forgot Password" link
        await page.getByText(/olvidaste tu contraseña/i).click();

        // Try to submit with invalid email
        await page.getByLabel(/email/i).fill('invalid-email');
        await page.getByRole('button', { name: /enviar enlace/i }).click();

        // HTML5 validation should prevent submission
        const emailInput = page.getByLabel(/email/i);
        const validationMessage = await emailInput.evaluate((el) => el.validationMessage);
        expect(validationMessage).toBeTruthy();
    });
});

test.describe('Reset Password Page', () => {
    test('should redirect to login if accessing reset password page without session', async ({ page }) => {
        // Try to access reset password page directly without being logged in
        await page.goto('/auth/reset-password');

        // Should be redirected to login
        await expect(page).toHaveURL(/\/login/);
    });

    test('should show password reset form with proper validation', async ({ page }) => {
        // Note: This test would require a valid recovery session
        // For now, we'll test the form structure when it's accessible
        // In a real scenario, you'd need to mock the auth state or use a test account

        // This is a placeholder - in practice you'd need to:
        // 1. Create a test user
        // 2. Request password reset
        // 3. Extract the recovery link from test email service
        // 4. Visit that link
        // 5. Then test the form

        test.skip('requires recovery session setup');
    });
});

test.describe('Password Reset Form Validation', () => {
    // These tests would require setting up a recovery session
    // Skipping for now as they need auth mocking or real email integration

    test.skip('should validate password length (minimum 6 characters)', async ({ page }) => {
        // Would test that passwords shorter than 6 characters show error
    });

    test.skip('should validate that passwords match', async ({ page }) => {
        // Would test that mismatched passwords show error
    });

    test.skip('should show success message and redirect after password update', async ({ page }) => {
        // Would test successful password update flow
    });

    test.skip('should show friendly error if session expires during password change', async ({ page }) => {
        // Would test session expiration handling
    });
});

test.describe('Middleware Protection During Recovery', () => {
    test.skip('should prevent navigation to other pages during recovery session', async ({ page }) => {
        // This test would require:
        // 1. Setting up a recovery session
        // 2. Attempting to navigate to /agenda, /gente, etc.
        // 3. Verifying redirect back to /auth/reset-password

        // Requires recovery session setup
    });

    test.skip('should allow navigation after successful password update', async ({ page }) => {
        // This test would require:
        // 1. Setting up a recovery session
        // 2. Updating password
        // 3. Verifying user can navigate freely

        // Requires recovery session setup
    });
});
