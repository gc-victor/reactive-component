import { expect, test } from "@playwright/test";

test.describe("Basic State and Events", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("basic-counter", { state: "visible" });
    });

    test("should increment count when increment button is clicked", async ({ page }) => {
        const counter = page.locator("basic-counter p");
        const incrementButton = page.locator("basic-counter button:has-text('Increment')");

        // Verify initial state
        await expect(counter).toHaveText("Count: 2");

        // Click increment button
        await incrementButton.click();

        // Verify count increased
        await expect(counter).toHaveText("Count: 3");
    });

    test("should decrement count when decrement button is clicked", async ({ page }) => {
        const counter = page.locator("basic-counter p");
        const decrementButton = page.locator("basic-counter button:has-text('Decrement')");

        // Verify initial state
        await expect(counter).toHaveText("Count: 2");

        // Click decrement button
        await decrementButton.click();

        // Verify count decreased
        await expect(counter).toHaveText("Count: 1");
    });

    test("should handle multiple increments", async ({ page }) => {
        const counter = page.locator("basic-counter p");
        const incrementButton = page.locator("basic-counter button:has-text('Increment')");

        // Click increment multiple times
        await incrementButton.click();
        await incrementButton.click();
        await incrementButton.click();

        // Verify count increased by 3
        await expect(counter).toHaveText("Count: 5");
    });

    test("should handle mixed increment and decrement", async ({ page }) => {
        const counter = page.locator("basic-counter p");
        const incrementButton = page.locator("basic-counter button:has-text('Increment')");
        const decrementButton = page.locator("basic-counter button:has-text('Decrement')");

        // Mixed operations
        await incrementButton.click();
        await incrementButton.click();
        await decrementButton.click();

        // Verify final count (2 + 2 - 1 = 3)
        await expect(counter).toHaveText("Count: 3");
    });
});
