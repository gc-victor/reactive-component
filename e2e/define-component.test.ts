import { expect, test } from "@playwright/test";

test.describe("Define Component (using define)", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("define-counter", { state: "visible" });
    });

    test("should display initial count", async ({ page }) => {
        const counter = page.locator("define-counter p span");

        // Verify initial count is 0
        await expect(counter).toHaveText("0");
    });

    test("should increment count when Increment button is clicked", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const incrementButton = page.locator("define-counter button:has-text('Increment')");

        // Verify initial state
        await expect(counter).toHaveText("0");

        // Click increment button
        await incrementButton.click();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify count increased
        await expect(counter).toHaveText("1");
    });

    test("should decrement count when Decrement button is clicked", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const decrementButton = page.locator("define-counter button:has-text('Decrement')");

        // Verify initial state
        await expect(counter).toHaveText("0");

        // Click decrement button
        await decrementButton.click();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify count decreased
        await expect(counter).toHaveText("-1");
    });

    test("should reset count to 0 when Reset button is clicked", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const incrementButton = page.locator("define-counter button:has-text('Increment')");
        const resetButton = page.locator("define-counter button:has-text('Reset')");

        // Increment a few times
        await incrementButton.click();
        await page.waitForTimeout(100);
        await incrementButton.click();
        await page.waitForTimeout(100);
        await incrementButton.click();
        await page.waitForTimeout(100);

        // Verify count increased
        await expect(counter).toHaveText("3");

        // Click reset button
        await resetButton.click();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify count reset to 0
        await expect(counter).toHaveText("0");
    });

    test("should handle multiple increments", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const incrementButton = page.locator("define-counter button:has-text('Increment')");

        // Click increment multiple times
        for (let i = 1; i <= 5; i++) {
            await incrementButton.click();
            await page.waitForTimeout(100);
            await expect(counter).toHaveText(i.toString());
        }
    });

    test("should handle multiple decrements", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const decrementButton = page.locator("define-counter button:has-text('Decrement')");

        // Click decrement multiple times
        for (let i = 1; i <= 5; i++) {
            await decrementButton.click();
            await page.waitForTimeout(100);
            await expect(counter).toHaveText((-i).toString());
        }
    });

    test("should handle mixed increment, decrement, and reset operations", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const incrementButton = page.locator("define-counter button:has-text('Increment')");
        const decrementButton = page.locator("define-counter button:has-text('Decrement')");
        const resetButton = page.locator("define-counter button:has-text('Reset')");

        // Mixed operations
        await incrementButton.click();
        await page.waitForTimeout(100);
        await incrementButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("2");

        await decrementButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("1");

        await incrementButton.click();
        await page.waitForTimeout(100);
        await incrementButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("3");

        await resetButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("0");

        await decrementButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("-1");
    });

    test("should reset from negative count", async ({ page }) => {
        const counter = page.locator("define-counter p span");
        const decrementButton = page.locator("define-counter button:has-text('Decrement')");
        const resetButton = page.locator("define-counter button:has-text('Reset')");

        // Decrement to negative
        await decrementButton.click();
        await page.waitForTimeout(100);
        await decrementButton.click();
        await page.waitForTimeout(100);
        await decrementButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("-3");

        // Reset
        await resetButton.click();
        await page.waitForTimeout(100);
        await expect(counter).toHaveText("0");
    });
});
