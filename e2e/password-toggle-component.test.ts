import { expect, test } from "@playwright/test";

test.describe("Password Toggle Component", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("password-toggle", { state: "visible" });
    });

    test("should display password input initially", async ({ page }) => {
        const passwordInput = page.locator("password-toggle input");

        // Verify input type is password
        const inputType = await passwordInput.getAttribute("type");
        expect(inputType).toBe("password");
    });

    test("should show password when toggle button is clicked", async ({ page }) => {
        const passwordInput = page.locator("password-toggle input");
        const toggleButton = page.locator("password-toggle button[aria-label='Toggle password visibility']");

        // Verify initial type is password
        await expect(passwordInput).toHaveAttribute("type", "password");

        // Click toggle button
        await toggleButton.click();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify type changed to text
        await expect(passwordInput).toHaveAttribute("type", "text");
    });

    test("should hide password when toggle button is clicked again", async ({ page }) => {
        const passwordInput = page.locator("password-toggle input");
        const toggleButton = page.locator("password-toggle button[aria-label='Toggle password visibility']");

        // Click toggle once to show
        await toggleButton.click();
        await page.waitForTimeout(100);
        await expect(passwordInput).toHaveAttribute("type", "text");

        // Click toggle again to hide
        await toggleButton.click();
        await page.waitForTimeout(100);
        await expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("should toggle icon visibility when clicked", async ({ page }) => {
        const toggleButton = page.locator("password-toggle button[aria-label='Toggle password visibility']");
        const showIcon = page.locator("password-toggle span[data-icon='show']");
        const hideIcon = page.locator("password-toggle span[data-icon='hide']");

        // Verify initial icon visibility (show icon visible, hide icon hidden)
        await expect(showIcon).toHaveCSS("display", "block");
        await expect(hideIcon).toHaveCSS("display", "none");

        // Click toggle
        await toggleButton.click();
        await page.waitForTimeout(100);

        // Verify icon visibility switched
        await expect(showIcon).toHaveCSS("display", "none");
        await expect(hideIcon).toHaveCSS("display", "block");
    });

    test("should maintain password value during toggle", async ({ page }) => {
        const passwordInput = page.locator("password-toggle input");
        const toggleButton = page.locator("password-toggle button[aria-label='Toggle password visibility']");

        // Enter password
        await passwordInput.fill("secretPassword123");

        // Toggle visibility
        await toggleButton.click();
        await page.waitForTimeout(100);

        // Verify value is maintained
        await expect(passwordInput).toHaveValue("secretPassword123");

        // Toggle back
        await toggleButton.click();
        await page.waitForTimeout(100);

        // Verify value is still maintained
        await expect(passwordInput).toHaveValue("secretPassword123");
    });

    test("should allow typing in both password and text mode", async ({ page }) => {
        const passwordInput = page.locator("password-toggle input");
        const toggleButton = page.locator("password-toggle button[aria-label='Toggle password visibility']");

        // Type in password mode
        await passwordInput.fill("part1");
        await expect(passwordInput).toHaveValue("part1");

        // Toggle to text mode
        await toggleButton.click();
        await page.waitForTimeout(100);

        // Continue typing in text mode
        await passwordInput.fill("part1part2");
        await expect(passwordInput).toHaveValue("part1part2");
    });
});
