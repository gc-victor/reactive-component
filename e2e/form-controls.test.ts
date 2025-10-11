import { expect, test } from "@playwright/test";

test.describe("Form Controls", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("form-demo", { state: "visible" });
    });

    test("should disable input when checkbox is unchecked", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");
        const status = page.locator("form-demo p#status span");

        // Verify checkbox is initially unchecked
        await expect(checkbox).not.toBeChecked();

        // Verify input is disabled
        await expect(textInput).toBeDisabled();

        // Verify status message
        await expect(status).toHaveText("Input disabled");
    });

    test("should enable input when checkbox is checked", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");

        // Check the checkbox
        await checkbox.check();

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify input is enabled
        await expect(textInput).toBeEnabled();
    });

    test("should show validation message for short input", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");
        const status = page.locator("form-demo p#status span");

        // Enable input
        await checkbox.check();
        await page.waitForTimeout(100);

        // Type short text (less than 3 characters)
        await textInput.fill("ab");
        await page.waitForTimeout(100);

        // Verify validation message
        await expect(status).toHaveText("Input too short (min 3 characters)");
    });

    test("should show success message for valid input", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");
        const status = page.locator("form-demo p#status span");

        // Enable input
        await checkbox.check();
        await page.waitForTimeout(100);

        // Type valid text (3 or more characters)
        await textInput.fill("hello");
        await page.waitForTimeout(100);

        // Verify success message with character count
        await expect(status).toHaveText("Input active: 5 characters");
    });

    test("should update character count dynamically", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");
        const status = page.locator("form-demo p#status span");

        // Enable input
        await checkbox.check();
        await page.waitForTimeout(100);

        // Type text and verify count updates
        await textInput.fill("test");
        await page.waitForTimeout(100);
        await expect(status).toHaveText("Input active: 4 characters");

        await textInput.fill("testing");
        await page.waitForTimeout(100);
        await expect(status).toHaveText("Input active: 7 characters");
    });

    test("should apply error styling for invalid input", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");

        // Enable input
        await checkbox.check();
        await page.waitForTimeout(100);

        // Type short text to trigger error styling
        await textInput.fill("ab");
        await page.waitForTimeout(100);

        // Verify error class is applied
        await expect(textInput).toHaveClass(/!border-red-500/);
    });

    test("should remove error styling for valid input", async ({ page }) => {
        const checkbox = page.locator("form-demo input#enabled");
        const textInput = page.locator("form-demo input[type='text']");

        // Enable input
        await checkbox.check();
        await page.waitForTimeout(100);

        // Type short text first
        await textInput.fill("ab");
        await page.waitForTimeout(100);

        // Then type valid text
        await textInput.fill("valid text");
        await page.waitForTimeout(100);

        // Verify error class is removed
        const classes = await textInput.getAttribute("class");
        expect(classes).not.toContain("!border-red-500");
    });
});
