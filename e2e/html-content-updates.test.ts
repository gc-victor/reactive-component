import { expect, test } from "@playwright/test";

test.describe("HTML Content Updates", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("html-toggler", { state: "visible" });
    });

    test("should display initial HTML content", async ({ page }) => {
        const content = page.locator("html-toggler p");

        // Check initial content with HTML strong tag
        const innerHTML = await content.innerHTML();
        expect(innerHTML).toContain("<strong>Initial</strong>");
        expect(innerHTML).toContain("content");
    });

    test("should toggle content when button is clicked", async ({ page }) => {
        const toggleButton = page.locator("html-toggler button:has-text('Toggle Content')");
        const content = page.locator("html-toggler p");

        // Click toggle button
        await toggleButton.click();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify alternate content
        const innerHTML = await content.innerHTML();
        expect(innerHTML).toContain("Alternate");
        expect(innerHTML).toContain("content");
    });

    test("should toggle back to initial content", async ({ page }) => {
        const toggleButton = page.locator("html-toggler button:has-text('Toggle Content')");
        const content = page.locator("html-toggler p");

        // Toggle twice to return to initial
        await toggleButton.click();
        await page.waitForTimeout(100);
        await toggleButton.click();
        await page.waitForTimeout(100);

        // Verify initial content is restored
        const innerHTML = await content.innerHTML();
        expect(innerHTML).toContain("<strong>Initial</strong>");
        expect(innerHTML).toContain("content");
    });

    test("should maintain HTML structure during multiple toggles", async ({ page }) => {
        const toggleButton = page.locator("html-toggler button:has-text('Toggle Content')");
        const content = page.locator("html-toggler p");

        // Toggle multiple times
        for (let i = 0; i < 5; i++) {
            await toggleButton.click();
            await page.waitForTimeout(100);
        }

        // Should be back to initial after odd number of toggles
        const innerHTML = await content.innerHTML();
        expect(innerHTML).toContain("Alternate");
    });

    test("should preserve CSS classes during content updates", async ({ page }) => {
        const toggleButton = page.locator("html-toggler button:has-text('Toggle Content')");
        const content = page.locator("html-toggler p");

        // Click toggle
        await toggleButton.click();
        await page.waitForTimeout(100);

        // Check that span with class exists
        const alternateSpan = content.locator("span.text-blue-500");
        await expect(alternateSpan).toBeVisible();
        await expect(alternateSpan).toHaveText("Alternate");
    });
});
