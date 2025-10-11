import { expect, test } from "@playwright/test";

test.describe("Computed Properties", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("temperature-converter", { state: "visible" });
    });

    test("should display initial Fahrenheit value correctly", async ({ page }) => {
        const fahrenheitDisplay = page.locator("temperature-converter p:has-text('Fahrenheit:') span");

        // Initial celsius is 20, which should be 68°F
        await expect(fahrenheitDisplay).toHaveText("68");
    });

    test("should update Fahrenheit when slider value changes", async ({ page }) => {
        const slider = page.locator("temperature-converter input[type='range']");
        const fahrenheitDisplay = page.locator("temperature-converter p:has-text('Fahrenheit:') span");

        // Change slider to 0°C (should be 32°F)
        await slider.fill("0");
        await page.waitForTimeout(100);
        await expect(fahrenheitDisplay).toHaveText("32");

        // Change slider to 30°C (should be 86°F)
        await slider.fill("30");
        await page.waitForTimeout(100);
        await expect(fahrenheitDisplay).toHaveText("86");

        // Change slider to 40°C (should be 104°F)
        await slider.fill("40");
        await page.waitForTimeout(100);
        await expect(fahrenheitDisplay).toHaveText("104");
    });

    test("should handle negative temperatures", async ({ page }) => {
        const slider = page.locator("temperature-converter input[type='range']");
        const celsiusDisplay = page.locator("temperature-converter p:has-text('Celsius:') span");
        const fahrenheitDisplay = page.locator("temperature-converter p:has-text('Fahrenheit:') span");

        // Set to 0°C
        await slider.fill("0");
        await page.waitForTimeout(100);

        await expect(celsiusDisplay).toHaveText("0");
        await expect(fahrenheitDisplay).toHaveText("32");
    });

    test("should maintain reactivity with multiple changes", async ({ page }) => {
        const slider = page.locator("temperature-converter input[type='range']");
        const fahrenheitDisplay = page.locator("temperature-converter p:has-text('Fahrenheit:') span");

        // Change multiple times
        await slider.fill("10");
        await page.waitForTimeout(100);
        await expect(fahrenheitDisplay).toHaveText("50");

        await slider.fill("25");
        await page.waitForTimeout(100);
        await expect(fahrenheitDisplay).toHaveText("77");

        await slider.fill("15");
        await page.waitForTimeout(100);
        await expect(fahrenheitDisplay).toHaveText("59");
    });
});
