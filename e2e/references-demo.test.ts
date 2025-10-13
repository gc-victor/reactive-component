import { expect, test } from "@playwright/test";

test.describe("References Demo", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("ref-demo", { state: "visible" });
    });

    test("should focus username input when Focus button is clicked", async ({ page }) => {
        const focusButton = page.locator("ref-demo button:has-text('Focus Username Input')");
        const usernameInput = page.locator("ref-demo input[placeholder='Username']");

        // Click focus button
        await focusButton.click();

        // Wait for focus
        await page.waitForTimeout(100);

        // Verify input is focused
        await expect(usernameInput).toBeFocused();
    });

    test("should measure element dimensions when Measure button is clicked", async ({ page }) => {
        const measureButton = page.locator("ref-demo button:has-text('Measure Box')");
        const dimensionsText = page.locator("ref-demo .text-sm span");

        // Verify initial state
        await expect(dimensionsText).toHaveText("Not measured yet");

        // Click measure button
        await measureButton.click();

        // Wait for measurement
        await page.waitForTimeout(100);

        // Verify dimensions are displayed (should match pattern like "XXXpx × YYYpx")
        const dimensions = await dimensionsText.textContent();
        expect(dimensions).toMatch(/\d+px × \d+px/);
    });

    test("should display both use case sections", async ({ page }) => {
        // Verify both sections are present
        await expect(page.locator("ref-demo label:has-text('1. Focus Management')")).toBeVisible();
        await expect(page.locator("ref-demo p:has-text('2. DOM Measurements')")).toBeVisible();
    });

    test("should update dimensions on repeated measurements", async ({ page }) => {
        const measureButton = page.locator("ref-demo button:has-text('Measure Box')");
        const dimensionsText = page.locator("ref-demo .text-sm span");

        // Click measure button
        await measureButton.click();
        await page.waitForTimeout(100);

        // Get first measurement
        const firstMeasurement = await dimensionsText.textContent();
        expect(firstMeasurement).toMatch(/\d+px × \d+px/);

        // Click again
        await measureButton.click();
        await page.waitForTimeout(100);

        // Second measurement should also be valid (may be same value)
        const secondMeasurement = await dimensionsText.textContent();
        expect(secondMeasurement).toMatch(/\d+px × \d+px/);
    });
});
