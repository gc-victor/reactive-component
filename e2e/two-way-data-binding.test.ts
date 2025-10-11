import { expect, test } from "@playwright/test";

test.describe("Two-way Data Binding", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("input-echo", { state: "visible" });
    });

    test("should update uppercase text when input is filled", async ({ page }) => {
        const input = page.locator("input-echo input");
        const output = page.locator("input-echo p span");

        // Verify initial state is empty
        await expect(output).toHaveText("");

        // Fill the input
        await input.fill("hello world");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify uppercase transformation
        await expect(output).toHaveText("HELLO WORLD");
    });

    test("should update text in real-time as user types", async ({ page }) => {
        const input = page.locator("input-echo input");
        const output = page.locator("input-echo p span");

        // Type character by character
        await input.type("test");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify transformation
        await expect(output).toHaveText("TEST");
    });

    test("should handle empty input", async ({ page }) => {
        const input = page.locator("input-echo input");
        const output = page.locator("input-echo p span");

        // Fill then clear
        await input.fill("temporary");
        await input.clear();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify empty state
        await expect(output).toHaveText("");
    });

    test("should handle special characters", async ({ page }) => {
        const input = page.locator("input-echo input");
        const output = page.locator("input-echo p span");

        // Fill with special characters
        await input.fill("hello@123!");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify uppercase transformation
        await expect(output).toHaveText("HELLO@123!");
    });
});
