# E2E Testing Guide for Reactive Component

This guide provides comprehensive documentation for running, writing, and maintaining E2E tests for the Reactive Component library.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Test Architecture](#test-architecture)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Patterns](#test-patterns)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Overview

The E2E test suite validates the complete functionality of reactive components in a real browser environment. Tests use Playwright to interact with components running in the examples application.

### Key Features

- **Comprehensive Coverage**: Tests all major component features including state management, bindings, and user interactions
- **Browser Testing**: Supports multiple browsers (Chromium, Firefox, Safari)
- **Parallel Execution**: Tests run in parallel for faster feedback
- **Detailed Reporting**: Rich HTML reports with screenshots and videos on failure
- **Robust Selectors**: Uses reliable element selection strategies
- **Enhanced Test Runner**: Custom orchestrator with better error handling and reporting

## Quick Start

### Prerequisites

```bash
# Install dependencies
pnpm install

# Build the library
pnpm build

# Install examples dependencies
cd examples && pnpm install && cd ..
```

### Running Tests

```bash
# Basic test run
pnpm test:e2e

# Enhanced test runner with better reporting
pnpm test:e2e:enhanced

# Run with UI (interactive mode)
pnpm test:e2e:ui

# Run in headed mode (see browser)
pnpm test:e2e:headed

# Run with verbose output
pnpm test:e2e:enhanced:verbose

# Run specific tests
pnpm test:e2e --grep "should increment"
```

## Test Architecture

### Directory Structure

```
e2e/
├── basic-state-and-events.test.ts      # Basic component state and event handling
├── two-way-data-binding.test.ts        # Input binding and reactive updates
├── computed-properties.test.ts         # Derived state calculations
├── form-controls.test.ts               # Form validation and control states
├── html-content-updates.test.ts        # Dynamic content updates
├── select-field-demo.test.ts           # Dropdown selection handling
├── json-state-management.test.ts       # Complex state serialization
├── references-demo.test.ts             # DOM element references
├── custom-progress-binding.test.ts     # Custom binding implementations
├── password-toggle-component.test.ts   # Component composition
├── expose-and-consume-context.test.ts  # Context API usage
└── define-component.test.ts            # Function-based components
```

### Test Components

Each test file validates specific component functionality:

| Test File | Component | Key Features Tested |
|-----------|-----------|-------------------|
| `basic-state-and-events.test.ts` | `basic-counter` | State updates, button clicks, reactive display |
| `two-way-data-binding.test.ts` | `input-echo` | Input binding, text transformation |
| `computed-properties.test.ts` | `temperature-converter` | Derived state, mathematical calculations |
| `form-controls.test.ts` | `form-demo` | Form validation, enable/disable states |
| `json-state-management.test.ts` | `json-state-manager` | Complex state serialization |
| `define-component.test.ts` | `define-counter` | Function-based component definition |

## Running Tests

### Standard Commands

```bash
# Run all tests
pnpm test:e2e

# Run with specific browser
pnpm test:e2e --project=chromium
pnpm test:e2e --project=firefox
pnpm test:e2e --project=webkit

# Run specific test file
pnpm test:e2e basic-state-and-events.test.ts

# Run tests matching pattern
pnpm test:e2e --grep "increment"

# Run with retries
pnpm test:e2e --retries=3
```

### Enhanced Test Runner

The custom test runner provides additional features:

```bash
# Basic enhanced run
pnpm test:e2e:enhanced

# With verbose output
pnpm test:e2e:enhanced:verbose

# In headed mode
pnpm test:e2e:enhanced:headed

# With custom browser selection
BROWSERS=chromium,firefox pnpm test:e2e:enhanced

# With debugging
DEBUG=true pnpm test:e2e:enhanced

# Custom test pattern
TEST_PATTERN="*counter*.test.ts" pnpm test:e2e:enhanced
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BROWSERS` | Comma-separated browser list | `chromium` |
| `TEST_PATTERN` | Test file pattern | `*.test.ts` |
| `VERBOSE` | Enable verbose output | `false` |
| `DEBUG` | Enable debug output | `false` |
| `CI` | CI environment flag | `false` |

## Writing Tests

### Basic Test Structure

```typescript
import { expect, test } from "@playwright/test";

test.describe("Component Name", () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the examples page
        await page.goto("/");

        // Wait for component to load
        await page.waitForSelector("component-name", { state: "visible" });
    });

    test("should perform expected behavior", async ({ page }) => {
        // Arrange: Get element references
        const button = page.locator("component-name button");
        const display = page.locator("component-name p");

        // Act: Perform user interaction
        await button.click();

        // Assert: Verify expected outcome
        await expect(display).toHaveText("Expected Text");
    });
});
```

### Selector Strategies

1. **Component Scoping**: Always scope selectors to the specific component
   ```typescript
   // Good: Scoped to component
   const button = page.locator("my-component button");

   // Bad: Global selector
   const button = page.locator("button");
   ```

2. **Reliable Selectors**: Use stable attributes when possible
   ```typescript
   // Good: Using stable attributes
   const input = page.locator('form-demo input[type="text"]');
   const status = page.locator('form-demo p:has-text("Status:")');

   // Avoid: Fragile class-based selectors
   const input = page.locator('.some-dynamic-class');
   ```

3. **Wait Strategies**: Always wait for elements to be ready
   ```typescript
   // Wait for component initialization
   await page.waitForSelector("component-name", { state: "visible" });

   // Wait for specific state changes
   await expect(element).toHaveText("Expected State");
   ```

### Handling Reactive Updates

Reactive components update asynchronously. Handle this properly:

```typescript
test("should handle reactive updates", async ({ page }) => {
    const input = page.locator("component input");
    const output = page.locator("component span");

    // Make change
    await input.fill("new value");

    // Wait for reactive update (small timeout if needed)
    await page.waitForTimeout(100);

    // Verify update
    await expect(output).toHaveText("NEW VALUE");
});
```

## Test Patterns

### Testing State Changes

```typescript
test("should update state correctly", async ({ page }) => {
    const counter = page.locator("counter-component p");
    const button = page.locator("counter-component button");

    // Verify initial state
    await expect(counter).toHaveText("Count: 0");

    // Test state change
    await button.click();
    await expect(counter).toHaveText("Count: 1");
});
```

### Testing Form Interactions

```typescript
test("should handle form validation", async ({ page }) => {
    const form = page.locator("form-component");
    const input = form.locator("input");
    const error = form.locator(".error-message");

    // Test invalid input
    await input.fill("invalid");
    await expect(error).toBeVisible();

    // Test valid input
    await input.fill("valid@email.com");
    await expect(error).not.toBeVisible();
});
```

### Testing Computed Properties

```typescript
test("should calculate derived values", async ({ page }) => {
    const slider = page.locator("component input[type='range']");
    const result = page.locator("component .calculated-value");

    // Test calculation
    await slider.fill("25");
    await expect(result).toHaveText("77");
});
```

### Testing Component Communication

```typescript
test("should communicate between components", async ({ page }) => {
    const producer = page.locator("producer-component");
    const consumer = page.locator("consumer-component");
    const button = producer.locator("button");

    // Trigger event in producer
    await button.click();

    // Verify consumer receives update
    await expect(consumer).toContainText("Updated Value");
});
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Element Not Found

**Problem**: `Element not found` or `Timeout` errors

**Solutions**:
```typescript
// Wait for component to load
await page.waitForSelector("component-name", { state: "visible" });

// Use more specific selectors
const element = page.locator("component-name specific-selector");

// Add debug information
console.log(await page.locator("component-name").count());
```

#### 2. Flaky Tests

**Problem**: Tests pass sometimes but fail randomly

**Solutions**:
```typescript
// Add explicit waits for state changes
await expect(element).toHaveText("expected text");

// Use waitForFunction for complex conditions
await page.waitForFunction(() => {
    return document.querySelector("component").shadowRoot !== null;
});

// Increase timeout for slow operations
await expect(element).toHaveText("text", { timeout: 10000 });
```

#### 3. Component Not Initializing

**Problem**: Components don't initialize properly

**Solutions**:
```typescript
// Wait for JavaScript to load
await page.waitForLoadState("networkidle");

// Wait for component registration
await page.waitForFunction(() => {
    return window.customElements.get("component-name") !== undefined;
});
```

#### 4. Reactive Updates Not Working

**Problem**: State changes don't reflect in DOM

**Solutions**:
```typescript
// Add small delay for reactive updates
await page.waitForTimeout(100);

// Wait for specific state
await page.waitForFunction(() => {
    const element = document.querySelector("component span");
    return element.textContent === "expected value";
});
```

### Debug Techniques

1. **Screenshots**: Capture state for analysis
   ```typescript
   await page.screenshot({ path: 'debug-screenshot.png' });
   ```

2. **Console Logs**: Check browser console
   ```typescript
   page.on('console', msg => console.log(msg.text()));
   ```

3. **Element Inspection**: Log element properties
   ```typescript
   const element = page.locator("selector");
   console.log(await element.textContent());
   console.log(await element.getAttribute("class"));
   ```

## Best Practices

### Test Organization

1. **Descriptive Names**: Use clear, descriptive test names
   ```typescript
   // Good
   test("should increment counter when increment button is clicked");

   // Bad
   test("test increment");
   ```

2. **Group Related Tests**: Use `test.describe` blocks
   ```typescript
   test.describe("Counter Component", () => {
       test.describe("Increment Functionality", () => {
           // Related increment tests
       });
   });
   ```

3. **Setup and Teardown**: Use hooks appropriately
   ```typescript
   test.beforeEach(async ({ page }) => {
       await page.goto("/");
       await page.waitForSelector("component");
   });
   ```

### Maintainability

1. **Page Object Pattern**: For complex interactions
   ```typescript
   class CounterPage {
       constructor(page) {
           this.page = page;
           this.counter = page.locator("counter-component");
       }

       async increment() {
           await this.counter.locator("button.increment").click();
       }

       async getCount() {
           return await this.counter.locator(".count").textContent();
       }
   }
   ```

2. **Shared Utilities**: Create helper functions
   ```typescript
   async function waitForComponentReady(page, componentName) {
       await page.waitForSelector(componentName, { state: "visible" });
       await page.waitForTimeout(100); // Allow for initialization
   }
   ```

3. **Data-Driven Tests**: Use test parameters
   ```typescript
   [
       { input: "10", expected: "50" },
       { input: "20", expected: "68" },
       { input: "30", expected: "86" }
   ].forEach(({ input, expected }) => {
       test(`should convert ${input}°C to ${expected}°F`, async ({ page }) => {
           // Test implementation
       });
   });
   ```

### Performance

1. **Parallel Execution**: Keep tests independent
2. **Selective Testing**: Use `test.only` for focused testing
3. **Efficient Selectors**: Use specific, fast selectors
4. **Minimal Waits**: Only wait when necessary

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: |
          npm install -g pnpm
          pnpm install
          cd examples && pnpm install

      - name: Build library
        run: pnpm build

      - name: Install Playwright
        run: pnpm exec playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e:enhanced
        env:
          CI: true

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### Environment-Specific Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.CI ? 'http://localhost:3000' : 'http://localhost:3000',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
  },
  workers: process.env.CI ? 1 : 4,
  retries: process.env.CI ? 2 : 0,
});
```

## Advanced Topics

### Custom Bindings Testing

```typescript
test("should handle custom binding", async ({ page }) => {
    const component = page.locator("custom-component");
    const progress = component.locator("progress");
    const button = component.locator("button");

    await button.click();

    // Wait for progress to start
    await expect(progress).toHaveAttribute("value", "10");

    // Test custom binding behavior
    await page.waitForFunction(() => {
        const progressEl = document.querySelector("custom-component progress");
        return progressEl && progressEl.value > 0;
    });
});
```

### Shadow DOM Testing

```typescript
test("should work with shadow DOM", async ({ page }) => {
    // Access shadow DOM elements
    const shadowContent = await page.evaluate(() => {
        const component = document.querySelector("my-component");
        return component.shadowRoot.querySelector(".internal-element").textContent;
    });

    expect(shadowContent).toBe("Expected Content");
});
```

### Testing Error States

```typescript
test("should handle error states gracefully", async ({ page }) => {
    const component = page.locator("error-prone-component");

    // Trigger error condition
    await page.route("**/api/data", route => route.fulfill({
        status: 500,
        body: "Server Error"
    }));

    await component.locator("button").click();

    // Verify error handling
    await expect(component.locator(".error-message")).toBeVisible();
});
```

## Conclusion

This E2E testing setup provides comprehensive coverage for Reactive Component functionality. The combination of Playwright's powerful testing capabilities and the enhanced test runner ensures reliable, maintainable tests that catch regressions and validate component behavior in real browser environments.

For questions or issues, refer to the [Playwright documentation](https://playwright.dev/) or open an issue in the project repository.
