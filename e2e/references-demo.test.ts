import { expect, test } from "@playwright/test";

test.describe("References Demo", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("ref-demo", { state: "visible" });
    });

    test("should display initial text", async ({ page }) => {
        const output = page.locator("ref-demo p[class*='text-xl']");

        // Verify initial text
        await expect(output).toHaveText("Initial Text");
    });

    test("should update text when Update Text button is clicked", async ({ page }) => {
        const updateButton = page.locator("ref-demo button:has-text('Update Text')");
        const output = page.locator("ref-demo p[class*='text-xl']");

        // Verify initial state
        await expect(output).toHaveText("Initial Text");

        // Click update button
        await updateButton.click();

        // Wait for update
        await page.waitForTimeout(100);

        // Verify text changed
        await expect(output).toHaveText("Updated Text Content");
    });

    test("should toggle text back and forth", async ({ page }) => {
        const updateButton = page.locator("ref-demo button:has-text('Update Text')");
        const output = page.locator("ref-demo p[class*='text-xl']");

        // Click once
        await updateButton.click();
        await page.waitForTimeout(100);
        await expect(output).toHaveText("Updated Text Content");

        // Click again to toggle back
        await updateButton.click();
        await page.waitForTimeout(100);
        await expect(output).toHaveText("Initial Text");
    });

    test("should change color when Change Color button is clicked", async ({ page }) => {
        const colorButton = page.locator("ref-demo button:has-text('Change Color')");
        const output = page.locator("ref-demo p[class*='text-xl']");

        // Get initial color
        const initialColor = await output.evaluate((el) => window.getComputedStyle(el).color);

        // Click color button
        await colorButton.click();

        // Wait for update
        await page.waitForTimeout(100);

        // Verify color changed
        const newColor = await output.evaluate((el) => window.getComputedStyle(el).color);
        expect(newColor).not.toBe(initialColor);
    });

    test("should toggle color back and forth", async ({ page }) => {
        const colorButton = page.locator("ref-demo button:has-text('Change Color')");
        const output = page.locator("ref-demo p[class*='text-xl']");

        // Get initial color
        const initialColor = await output.evaluate((el) => window.getComputedStyle(el).color);

        // Click once
        await colorButton.click();
        await page.waitForTimeout(100);
        const changedColor = await output.evaluate((el) => window.getComputedStyle(el).color);
        expect(changedColor).not.toBe(initialColor);

        // Click again to toggle back
        await colorButton.click();
        await page.waitForTimeout(100);
        const finalColor = await output.evaluate((el) => window.getComputedStyle(el).color);
        expect(finalColor).toBe(initialColor);
    });

    test("should handle text and color updates independently", async ({ page }) => {
        const updateButton = page.locator("ref-demo button:has-text('Update Text')");
        const colorButton = page.locator("ref-demo button:has-text('Change Color')");
        const output = page.locator("ref-demo p[class*='text-xl']");

        // Update text
        await updateButton.click();
        await page.waitForTimeout(100);
        await expect(output).toHaveText("Updated Text Content");

        // Change color
        await colorButton.click();
        await page.waitForTimeout(100);

        // Verify text is still updated
        await expect(output).toHaveText("Updated Text Content");
    });
});
