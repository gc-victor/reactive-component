import { expect, test } from "@playwright/test";

test.describe("Custom Progress Binding", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("custom-progress-binding", { state: "visible" });
    });

    test("should display initial progress state", async ({ page }) => {
        const progressBar = page.locator("custom-progress-binding progress");
        const status = page.locator("custom-progress-binding p:not(.flex)");

        // Verify initial progress value is 0
        const value = await progressBar.getAttribute("value");
        expect(value).toBe("0");

        // Verify initial status
        await expect(status).toHaveText("Starting...");
    });

    test("should start progress when Start Progress button is clicked", async ({ page }) => {
        const startButton = page.locator("custom-progress-binding button:has-text('Start Progress')");
        const progressBar = page.locator("custom-progress-binding progress");
        const status = page.locator("custom-progress-binding p:not(.flex)");

        // Click start button
        await startButton.click();

        // Wait for progress to update
        await page.waitForTimeout(600);

        // Verify progress has increased
        const value = await progressBar.getAttribute("value");
        expect(Number.parseInt(value || "0")).toBeGreaterThan(0);

        // Verify status shows loading
        const statusText = await status.textContent();
        expect(statusText).toContain("Loading:");
    });

    test("should stop progress when Stop Progress button is clicked", async ({ page }) => {
        const startButton = page.locator("custom-progress-binding button:has-text('Start Progress')");
        const stopButton = page.locator("custom-progress-binding button:has-text('Stop Progress')");
        const progressBar = page.locator("custom-progress-binding progress");

        // Start progress
        await startButton.click();
        await page.waitForTimeout(600);

        // Get current progress value
        const progressBeforeStop = await progressBar.getAttribute("value");

        // Stop progress
        await stopButton.click();
        await page.waitForTimeout(600);

        // Verify progress hasn't increased further
        const progressAfterStop = await progressBar.getAttribute("value");
        expect(progressAfterStop).toBe(progressBeforeStop);
    });

    test("should complete progress at 100%", async ({ page }) => {
        const startButton = page.locator("custom-progress-binding button:has-text('Start Progress')");
        const progressBar = page.locator("custom-progress-binding progress");
        const status = page.locator("custom-progress-binding p:not(.flex)");

        // Start progress
        await startButton.click();

        // Wait for completion (10 steps * 500ms + buffer)
        await page.waitForTimeout(6000);

        // Verify progress is 100
        const value = await progressBar.getAttribute("value");
        expect(value).toBe("100");

        // Verify completion message
        await expect(status).toHaveText("Complete!");
    });

    test("should disable Start button when progress is running", async ({ page }) => {
        const startButton = page.locator("custom-progress-binding button:has-text('Start Progress')");

        // Verify start button is enabled initially
        await expect(startButton).toBeEnabled();

        // Start progress
        await startButton.click();
        await page.waitForTimeout(100);

        // Verify start button is now disabled
        await expect(startButton).toBeDisabled();
    });

    test("should keep Stop button enabled when progress is running", async ({ page }) => {
        const startButton = page.locator("custom-progress-binding button:has-text('Start Progress')");
        const stopButton = page.locator("custom-progress-binding button:has-text('Stop Progress')");

        // Start progress
        await startButton.click();
        await page.waitForTimeout(100);

        // Verify stop button is enabled during progress
        await expect(stopButton).toBeEnabled();
    });

    test("should re-enable Start button after stopping", async ({ page }) => {
        const startButton = page.locator("custom-progress-binding button:has-text('Start Progress')");
        const stopButton = page.locator("custom-progress-binding button:has-text('Stop Progress')");

        // Start progress
        await startButton.click();
        await page.waitForTimeout(600);

        // Stop progress
        await stopButton.click();
        await page.waitForTimeout(100);

        // Verify start button is enabled again
        await expect(startButton).toBeEnabled();
    });
});
