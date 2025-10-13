import { expect, test } from "@playwright/test";

test.describe("Expose and Consume Context", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("theme-provider", { state: "visible" });
    });

    test("should display initial theme as light", async ({ page }) => {
        const themeConsumer = page.locator("theme-consumer");
        const themeInfo = themeConsumer.locator("p");

        // Wait for component initialization
        await page.waitForTimeout(200);

        // Verify initial theme is light
        await expect(themeInfo).toHaveText("Current Theme: light");
    });

    test("should toggle theme when Toggle Theme button is clicked", async ({ page }) => {
        const toggleButton = page.locator("theme-provider button:has-text('Toggle Theme')");
        const themeConsumer = page.locator("theme-consumer");
        const themeInfo = themeConsumer.locator("p");

        // Wait for initialization
        await page.waitForTimeout(200);

        // Verify initial theme
        await expect(themeInfo).toHaveText("Current Theme: light");

        // Click toggle button
        await toggleButton.click();

        // Wait for reactive update
        await page.waitForTimeout(200);

        // Verify theme changed to dark
        await expect(themeInfo).toHaveText("Current Theme: dark");
    });

    test("should toggle theme back to light", async ({ page }) => {
        const toggleButton = page.locator("theme-provider button:has-text('Toggle Theme')");
        const themeConsumer = page.locator("theme-consumer");
        const themeInfo = themeConsumer.locator("p");

        // Wait for initialization
        await page.waitForTimeout(200);

        // Toggle to dark
        await toggleButton.click();
        await page.waitForTimeout(200);
        await expect(themeInfo).toHaveText("Current Theme: dark");

        // Toggle back to light
        await toggleButton.click();
        await page.waitForTimeout(200);
        await expect(themeInfo).toHaveText("Current Theme: light");
    });

    test("should update theme mode text", async ({ page }) => {
        const toggleButton = page.locator("theme-provider button:has-text('Toggle Theme')");
        const themeConsumer = page.locator("theme-consumer");
        const themeModeText = themeConsumer.locator("p");

        // Wait for initialization
        await page.waitForTimeout(200);

        // Verify initial theme mode
        await expect(themeModeText).toHaveText("Current Theme: light");

        // Toggle theme
        await toggleButton.click();
        await page.waitForTimeout(200);

        // Verify theme mode updated
        await expect(themeModeText).toHaveText("Current Theme: dark");
    });

    test("should update button theme text", async ({ page }) => {
        const toggleButton = page.locator("theme-provider button:has-text('Toggle Theme')");
        const themeConsumer = page.locator("theme-consumer");
        const buttonThemeText = themeConsumer.locator("p");

        // Wait for initialization
        await page.waitForTimeout(200);

        // Verify initial button theme
        await expect(buttonThemeText).toHaveText("Current Theme: light");

        // Toggle theme
        await toggleButton.click();
        await page.waitForTimeout(200);

        // Verify button theme updated
        await expect(buttonThemeText).toHaveText("Current Theme: dark");
    });

    test("should apply background and text classes based on theme", async ({ page }) => {
        const toggleButton = page.locator("theme-provider button:has-text('Toggle Theme')");
        const themeConsumer = page.locator("theme-consumer");

        // Wait for initialization
        await page.waitForTimeout(200);

        // Verify light theme classes
        const lightClasses = await themeConsumer.getAttribute("class");
        expect(lightClasses).toContain("bg-slate-200");
        expect(lightClasses).toContain("text-slate-900");

        // Toggle to dark theme
        await toggleButton.click();
        await page.waitForTimeout(200);

        // Verify dark theme classes
        const darkClasses = await themeConsumer.getAttribute("class");
        expect(darkClasses).toContain("bg-slate-900");
        expect(darkClasses).toContain("text-slate-50");
    });

    test("should handle multiple theme toggles", async ({ page }) => {
        const toggleButton = page.locator("theme-provider button:has-text('Toggle Theme')");
        const themeConsumer = page.locator("theme-consumer");
        const themeInfo = themeConsumer.locator("p");

        // Wait for initialization
        await page.waitForTimeout(200);

        // Toggle multiple times
        for (let i = 0; i < 4; i++) {
            await toggleButton.click();
            await page.waitForTimeout(200);

            const expectedTheme = i % 2 === 0 ? "dark" : "light";
            await expect(themeInfo).toHaveText(`Current Theme: ${expectedTheme}`);
        }
    });
});
