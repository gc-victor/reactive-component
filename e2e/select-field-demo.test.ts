import { expect, test } from "@playwright/test";

test.describe("Select Field Demo", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("select-demo", { state: "visible" });
    });

    test("should display empty selected value initially", async ({ page }) => {
        const selectedValue = page.locator("select-demo p span");

        // Verify initial state is empty
        await expect(selectedValue).toHaveText("");
    });

    test("should update selected value when option is selected", async ({ page }) => {
        const select = page.locator("select-demo select");
        const selectedValue = page.locator("select-demo p span");

        // Select option 1
        await select.selectOption("option1");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify selected value displays option text and value
        await expect(selectedValue).toHaveText("Option 1 (option1)");
    });

    test("should handle different option selections", async ({ page }) => {
        const select = page.locator("select-demo select");
        const selectedValue = page.locator("select-demo p span");

        // Select option 2
        await select.selectOption("option2");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("Option 2 (option2)");

        // Select option 3
        await select.selectOption("option3");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("Option 3 (option3)");
    });

    test("should return to empty state when default option is selected", async ({ page }) => {
        const select = page.locator("select-demo select");
        const selectedValue = page.locator("select-demo p span");

        // Select an option first
        await select.selectOption("option1");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("Option 1 (option1)");

        // Select the default empty option
        await select.selectOption("");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("");
    });

    test("should maintain reactivity through multiple selections", async ({ page }) => {
        const select = page.locator("select-demo select");
        const selectedValue = page.locator("select-demo p span");

        // Make multiple selections
        await select.selectOption("option1");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("Option 1 (option1)");

        await select.selectOption("option3");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("Option 3 (option3)");

        await select.selectOption("option2");
        await page.waitForTimeout(100);
        await expect(selectedValue).toHaveText("Option 2 (option2)");
    });
});
