import { expect, test } from "@playwright/test";

test.describe("JSON State Management", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.waitForSelector("json-state-management", { state: "visible" });
    });

    test("should display initial JSON state", async ({ page }) => {
        const jsonOutput = page.locator("json-state-management pre code");

        // Wait for component to initialize
        await page.waitForTimeout(100);

        // Verify initial JSON structure
        const jsonText = await jsonOutput.textContent();
        expect(jsonText).toBeTruthy();
        
        const json = JSON.parse(jsonText || "{}");

        expect(json).toEqual({
            name: "Paco Doe",
            age: 30,
            bio: "",
        });
    });

    test("should update JSON when name is changed", async ({ page }) => {
        const nameInput = page.locator("json-state-management input#name");
        const jsonOutput = page.locator("json-state-management pre code");

        // Change name
        await nameInput.fill("John Smith");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify JSON update
        const jsonText = await jsonOutput.textContent();
        const json = JSON.parse(jsonText || "{}");

        expect(json.name).toBe("John Smith");
    });

    test("should update JSON when age is changed", async ({ page }) => {
        const ageInput = page.locator("json-state-management input#age");
        const jsonOutput = page.locator("json-state-management pre code");

        // Change age
        await ageInput.fill("25");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify JSON update
        const jsonText = await jsonOutput.textContent();
        const json = JSON.parse(jsonText || "{}");

        expect(json.age).toBe(25);
    });

    test("should update JSON when bio is changed", async ({ page }) => {
        const bioInput = page.locator("json-state-management textarea#bio");
        const jsonOutput = page.locator("json-state-management pre code");

        // Change bio
        await bioInput.fill("Software developer");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify JSON update
        const jsonText = await jsonOutput.textContent();
        const json = JSON.parse(jsonText || "{}");

        expect(json.bio).toBe("Software developer");
    });

    test("should handle multiple field changes", async ({ page }) => {
        const nameInput = page.locator("json-state-management input#name");
        const ageInput = page.locator("json-state-management input#age");
        const bioInput = page.locator("json-state-management textarea#bio");
        const jsonOutput = page.locator("json-state-management pre code");

        // Change all fields
        await nameInput.fill("Jane Doe");
        await ageInput.fill("28");
        await bioInput.fill("Full stack engineer");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Verify all JSON updates
        const jsonText = await jsonOutput.textContent();
        const json = JSON.parse(jsonText || "{}");

        expect(json).toEqual({
            name: "Jane Doe",
            age: 28,
            bio: "Full stack engineer",
        });
    });

    test("should display valid JSON output", async ({ page }) => {
        const jsonOutput = page.locator("json-state-management pre code");

        // Wait for reactive update
        await page.waitForTimeout(100);

        // Get JSON text
        const jsonText = await jsonOutput.textContent();

        // Verify it's valid JSON
        expect(jsonText).toBeTruthy();
        const json = JSON.parse(jsonText || "{}");
        
        // Verify structure exists
        expect(json).toHaveProperty("name");
        expect(json).toHaveProperty("age");
        expect(json).toHaveProperty("bio");
    });
});
