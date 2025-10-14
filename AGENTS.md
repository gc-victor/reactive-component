# AGENTS.md

**Project**: `reactive-component` • **Last Updated**: 2025-09-05 (UTC)

## Purpose

This file is the onboarding manual for every AI assistant (Claude, Cursor, GPT, etc.) and every human who edits this repository. It encodes our coding standards, guard-rails, and workflow tricks so the **human 30%** (architecture, tests, domain judgment) stays in human hands.[^1]

[^1]: This principle emphasizes human oversight for critical aspects like architecture, testing, and domain-specific decisions, ensuring AI assists rather than fully dictates development.

---

## 0. Project Overview

### Introduction

`reactive-component` is a library and example workspace for building robust, accessible Web Components using the ReactiveComponent library. It focuses on component-driven development, predictable reactive state management, and clean separation between structure (HTML), behavior (TypeScript/JavaScript), and style (CSS).

### Core Components

| Component         | Description                                                                      |
| ----------------- | -------------------------------------------------------------------------------- |
| **reactive-core** | Base ReactiveComponent class and reactive state engine                           |
| **components**    | Reusable Web Components built with ReactiveComponent                             |
| **examples**      | Example usages demonstrating bindings, computed state, refs, and custom handlers |
| **docs**          | Documentation and best practices for the framework                               |
| **tooling**       | Linting, formatting, type-checking, and build tools                              |

### Golden Rule

> **When unsure about implementation details or requirements, ALWAYS consult the developer rather than making assumptions.**

---

## 1. Non-Negotiable Golden Rules

| #       | AI _may_ do                                                                                                                 | ❌ AI _must NOT_ do                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **G-0** | Whenever unsure about something that's related to the project, ask the developer for clarification before making changes.   | ❌ Write changes or modify configs when you are not sure about project-specific expectations or conventions. |
| **G-1** | Generate code **only inside** relevant source directories (`src/`, `components/`, `examples/`) or explicitly pointed files. | ❌ Touch `tests/` or specification files without explicit instruction (humans own tests & specs).            |
| **G-2** | Add/update **`AIDEV-NOTE:`** anchor comments near non-trivial edited code.                                                  | ❌ Delete or mangle existing `AIDEV-*` comments.                                                             |
| **G-3** | Follow the project's configured formatter and linter (Biome via `biome.json`). Use configured scripts.                      | ❌ Re-format code to any other style or add competing formatters/linters.                                    |
| **G-4** | For changes **>300 LOC** or **>3 files**, ask for confirmation.                                                             | ❌ Refactor large modules without human guidance.                                                            |
| **G-5** | Stay within the current task context. Inform the dev if it'd be better to start afresh.                                     | ❌ Continue work from a prior prompt after "new task" – start a fresh session.                               |

---

## 2. Build, Test & Utility Commands

### Introduction

Use package manager scripts for consistency (they ensure correct environment variables and configuration). If a script is missing, request guidance instead of guessing.

### Commands

```bash
# Dependencies
pnpm ci                  # install dependencies (CI-friendly)
pnpm install             # local install

# Development
pnpm build               # build library/components
pnpm dev                 # local development (avoid long-running servers in non-interactive contexts)

# Quality Assurance
pnpm test                # run unit tests (Vitest)
pnpm lint                # lint (Biome)
pnpm format              # format (Biome)
pnpm typecheck           # TypeScript type checking
```

> **Note**: Ensure correct CWD (project root) before running commands. Avoid launching watchers/servers in contexts that cannot be terminated.

---

## 3. Coding Standards

### Standards Table

| Aspect                | Standard                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Language**          | TypeScript preferred; modern JavaScript acceptable for small, isolated examples                                                            |
| **Web Components**    | Custom Elements v1; use Shadow DOM as needed; follow platform standards                                                                    |
| **ReactiveComponent** | Single source of truth, unidirectional data flow, predictable state transitions                                                            |
| **Formatting**        | Biome (`biome.json`). Do not manually reformat against project standards                                                                   |
| **Linting**           | Biome. Fix only relevant rules; do not disable globally without discussion                                                                 |
| **Typing**            | Strict TypeScript where applicable; avoid `any` except at unavoidable integration boundaries                                               |
| **Naming**            | `camelCase` (vars/functions), `PascalCase` (classes/components), `SCREAMING_SNAKE_CASE` (constants), `kebab-case` for custom element names |
| **Documentation**     | JSDoc/TS doc comments for public classes/methods; concise inline comments for complex logic                                                |
| **Error Handling**    | Validate inputs; fail loudly in dev; maintain last known-good state on binding errors                                                      |
| **Accessibility**     | ARIA where appropriate; keyboard nav; focus management; color contrast                                                                     |

### Error Handling Patterns

- **Validate** state transitions and event payloads before applying
- **Prefer** typed errors and actionable messages in development
- **Keep** last valid state on binding errors; suggest corrections; use safe defaults

```typescript
// AIDEV-NOTE: Guard example for state updates
function setCount(component: ReactiveComponent, value: unknown) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    // AIDEV-NOTE: keep last valid state; log and suggest correction
    console.error("Invalid count; expected number.");
    return; // keep last valid state
  }
  component.setState("count", value);
}
```

---

## 4. Project Layout & Core Components

### Directory Structure (Current)

| Path                           | Description                                        |
| ------------------------------ | -------------------------------------------------- |
| `src/`                         | Core library code (ReactiveComponent and helpers)  |
| `public/`                      | Static assets for examples or demos                |
| `tests/`                       | Unit/integration tests (Vitest)                    |
| `dist/`                        | Build outputs (do not edit)                        |
| `coverage/`                    | Test coverage artifacts (do not edit)              |
| `.github/`, `.query/`, `.dbs/` | Meta/config directories                            |
| `prompt.txt`                   | Authoritative prompt/spec informing this AGENTS.md |

> **Note**: If paths evolve, update this section and prefer directory-specific AGENTS.md files for deeper context.

### Domain Concepts

| Concept                                 | Definition                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Component**                           | A custom element (tag) with encapsulated state and lifecycle                                                         |
| **State**                               | Single source of truth; updated via setState or direct property setters with reactivity                              |
| **Computed**                            | Derived state recomputed from dependencies                                                                           |
| **Binding**                             | Declarative connection between DOM and state (e.g., `$bind-text`)                                                    |
| **Ref**                                 | Named DOM reference accessible via `this.refs`                                                                       |
| **Function-based Component (`define`)** | Component registered via `define(name, definition)` using a context object instead of a class                        |
| **$state**                              | Property-only state API (Proxy) inside `define()`; read/write with `$state.key`; keys must be alphanumeric           |
| **$bind**                               | Map of methods assigned in `define()` for event attributes (e.g., `$bind.increment = () => {}; onclick="increment"`) |
| **$compute**                            | Define a derived state value in `define()`; signature `(key, sources, computation)`                                  |
| **$effect**                             | Register a side-effect in `define()`; callback may return a cleanup function                                         |
| **$ref**                                | Retrieve elements registered via `$ref` attributes inside `define()`                                                 |

---

## 5. Anchor Comments

### Introduction

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.

### Guidelines

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps) for comments aimed at AI and developers
- Keep them concise (≤ 120 chars)
- **Important**: Before scanning, locate existing anchors `AIDEV-*` in relevant subdirectories
- Update relevant anchors when modifying associated code
- Do not remove `AIDEV-NOTE`s without explicit instruction
- Add anchors for long/complex/important code or potential pitfalls

### Example

```typescript
// AIDEV-NOTE: binding hot-path; avoid extra DOM reads; rely on computed props
// AIDEV-TODO: support locale-aware formatting for 'count'
// AIDEV-QUESTION: should disabled state mirror aria-disabled?
```

---

## 6. Commit Discipline

### Guidelines

| Guideline                    | Description                                                      |
| ---------------------------- | ---------------------------------------------------------------- |
| **Granular commits**         | One logical change per commit                                    |
| **Tag AI-generated commits** | e.g., `feat: add range slider component [AI]`                    |
| **Clear messages**           | Explain the _why_; link to issues/ADRs for architectural changes |
| **Use git worktree**         | For parallel/long-running AI branches                            |
| **Review AI-generated code** | Never merge code you don't understand                            |

---

## 7. Component API & Codegen

### Instructions

- If API docs or types are generated, prefer editing the source-of-truth (TSDoc/comments/types) then regenerate artifacts via scripts
- Do **NOT** manually edit generated files (`dist/`, type declarations produced by build); changes will be overwritten
- Keep example usage in docs/examples aligned with public component APIs

---

## 8. Bindings and Validation (ReactiveComponent)

### Core Constraints (from prompt.txt)

| Constraint                        | Rule                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HTML Structure First**          | You **MUST** first generate the HTML structure for any component                                                                                                                |
| **Approval Gate**                 | Ask for permission after the HTML is generated, before starting TypeScript/JavaScript                                                                                           |
| **Binding Validation**            | Attributes prefixed with `$` must contain only alphanumeric characters (a-z, A-Z, 0-9). No expressions or interpolation in bindings. Violations are errors; suggest corrections |
| **State Management**              | All state logic must be handled in TypeScript/JavaScript via ReactiveComponent. Avoid direct DOM manipulation for state changes; use state + bindings                           |
| **Separation of Concerns**        | Never embed HTML or CSS in TypeScript/JavaScript files; user-facing text must live in HTML templates for maintainability/localization                                           |
| **Icons**                         | Use Lucide Icons SVGs for icons                                                                                                                                                 |
| **Avoid Expressions in Bindings** | Use computed properties instead                                                                                                                                                 |

### Validation Rule

> **Binding attribute values must match regex**: `^[a-zA-Z0-9]+$`

### Binding Error Handling Strategy

1. Log detailed error
2. Suggest correction
3. Maintain last valid state
4. Fallback to default value

---

## 9. Testing Framework (Vitest)

### Guidelines

- Use **Vitest** for unit tests. Keep tests fast and deterministic
- **DOM behavior**: test via jsdom or a lightweight DOM utility
- **Accessibility checks**: consider axe or role/label queries for critical components
- Place tests under `tests/` mirroring source structure
- **For focused runs**: `pnpm test -t "pattern"` or use Vitest's filtering flags

---

## 9.1. E2E Testing Framework (Playwright)

### Introduction

E2E tests validate complete component functionality in real browser environments using Playwright. Tests run against the examples application to ensure components behave correctly with user interactions, state management, and reactive updates.

**Complete Documentation**: See [e2e/README.md](e2e/README.md) for comprehensive testing patterns, troubleshooting, and advanced topics.

### Prerequisites

**CRITICAL**: Before running E2E tests, you **MUST** start the example server:

```bash
pnpm example:server
```

This command builds the library and starts the examples application at `http://localhost:3000`.

### Commands

```bash
# Start example server (REQUIRED before running tests)
pnpm example:server           # build and start examples server

# Run E2E tests
pnpm test:e2e                 # run all e2e tests
pnpm test:e2e:ui              # interactive UI mode
pnpm test:e2e:headed          # visible browser mode
pnpm test:e2e:debug           # debug mode with step-through

# Run specific tests
pnpm test:e2e --grep "counter"        # tests matching pattern
pnpm test:e2e basic-state.test.ts     # specific test file
```

### Key Testing Principles

| Principle              | Guideline                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| **Component Scoping**  | Always scope selectors to specific components (e.g., `page.locator("my-component button")`)  |
| **Wait for Readiness** | Use `await page.waitForSelector("component-name", { state: "visible" })` before interactions |
| **Reactive Updates**   | Account for async updates; use `await expect(element).toHaveText("value")` or small delays   |
| **Stable Selectors**   | Prefer stable attributes (type, role, text) over fragile class names                         |
| **Descriptive Names**  | Use clear test names describing expected behavior                                            |
| **Test Independence**  | Each test should run independently; avoid shared state                                       |

### Test Structure Pattern

```typescript
import { expect, test } from "@playwright/test";

test.describe("Component Name", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("component-name", { state: "visible" });
  });

  test("should perform expected behavior", async ({ page }) => {
    const button = page.locator("component-name button");
    const display = page.locator("component-name p");

    await button.click();
    await expect(display).toHaveText("Expected Text");
  });
});
```

### What to Test

- **State Management**: Verify state updates reflect in DOM
- **User Interactions**: Click, input, form submission, keyboard navigation
- **Computed Properties**: Derived values calculate correctly
- **Bindings**: Two-way data binding, reactive updates
- **Form Validation**: Input validation, error states, enable/disable logic
- **Component Communication**: Context/events between components
- **Custom Bindings**: Specialized binding behavior

### Common Patterns

#### Testing State Changes

```typescript
test("should update state correctly", async ({ page }) => {
  const counter = page.locator("counter-component p");
  const button = page.locator("counter-component button");

  await expect(counter).toHaveText("Count: 0");
  await button.click();
  await expect(counter).toHaveText("Count: 1");
});
```

#### Testing Reactive Updates

```typescript
test("should handle reactive updates", async ({ page }) => {
  const input = page.locator("component input");
  const output = page.locator("component span");

  await input.fill("new value");
  await page.waitForTimeout(100); // Allow for reactive update
  await expect(output).toHaveText("NEW VALUE");
});
```

### Troubleshooting

| Issue                          | Solution                                                              |
| ------------------------------ | --------------------------------------------------------------------- |
| **Element not found**          | Add `await page.waitForSelector("component", { state: "visible" })`   |
| **Flaky tests**                | Use Playwright assertions (`await expect()`) instead of manual delays |
| **State not updating**         | Add `await page.waitForTimeout(100)` for reactive updates             |
| **Component not initializing** | Wait for load state: `await page.waitForLoadState("networkidle")`     |

### Directory Structure

E2E tests are located in `e2e/` directory, organized by component feature:

- `basic-state-and-events.test.ts` - State updates and events
- `two-way-data-binding.test.ts` - Input binding
- `computed-properties.test.ts` - Derived state
- `form-controls.test.ts` - Form validation
- `define-component.test.ts` - Function-based components
- `custom-progress-binding.test.ts` - Custom bindings
- And more...

### CI/CD Integration

E2E tests run in CI environments. The configuration automatically:

- Adjusts worker count (1 in CI, 4 locally)
- Sets retry policy (2 retries in CI, 0 locally)
- Captures traces and videos on failure
- Uploads artifacts for debugging

---

## 10. Directory-Specific AGENTS.md Files

### Guidelines

- **Always check** for AGENTS.md files in specific directories before working on code within them
- If a directory's AGENTS.md is outdated or incorrect, **update it**
- If you make significant changes to a directory's structure, patterns, or critical implementation details, **document these** in its AGENTS.md
- If a directory lacks an AGENTS.md but contains complex logic or patterns, **suggest creating one**

---

## 11. Common Pitfalls (ReactiveComponent)

### Watch Out For

- **Skipping HTML-first**: Implementing TS/JS before the HTML structure
- **Binding violations**: Using non-alphanumeric values or expressions/interpolation in `$` attributes
- **Mixing DOM manipulation with state**: Directly mutating DOM instead of updating state/computed bindings
- **Hardcoding user-facing text in TS/JS**: All text must be in HTML templates
- **Over-coupling components**: Violating component autonomy or leaking internal state
- **Ignoring accessibility**: Missing labels, roles, keyboard support, or focus management
- **Performance regressions**: Heavy computations in render paths instead of computed props
- **Not using Lucide Icons** for icons

---

## 12. Versioning Conventions

| Version Type | Description                  |
| ------------ | ---------------------------- |
| **MAJOR**    | Breaking changes             |
| **MINOR**    | Backward-compatible features |
| **PATCH**    | Bug fixes                    |

- This library follows **Semantic Versioning (SemVer: MAJOR.MINOR.PATCH)** via `package.json`
- Document public API changes and migration guidance in `CHANGELOG.md`

---

## 13. Key File & Pattern References

### Introduction

Update these pointers to match real paths as the repository evolves.

### References

| Topic                     | Location                                                          | Description                               |
| ------------------------- | ----------------------------------------------------------------- | ----------------------------------------- |
| **Authoritative rules**   | `prompt.txt`                                                      | Source for binding/HTML-first constraints |
| **Core library**          | `src/`                                                            | ReactiveComponent, bindings, state engine |
| **Components & examples** | `src/components/`, `examples/`                                    | (if present)                              |
| **Build & type configs**  | `tsconfig.json`, `package.json`, `biome.json`, `vitest.config.ts` | Configuration files                       |
| **Tests**                 | `tests/`                                                          | Vitest patterns                           |

---

## 14. Domain-Specific Terminology

### Glossary

| Term                                    | Definition                                                                                                           |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **ReactiveComponent**                   | Base class providing reactive state, computed properties, and declarative bindings to DOM                            |
| **Function-based Component (`define`)** | Component registered via `define(name, definition)` using a context object instead of a class                        |
| **Binding**                             | Attribute-based connection from state to DOM (e.g., `$bind-text="status"`)                                           |
| **Computed Property**                   | Derived state recomputed from dependencies via `compute()` or `$compute()`                                           |
| **Ref**                                 | Named handle to a DOM node within the component (`this.refs.name` or `$ref.name`)                                    |
| **$state**                              | Property-only state API (Proxy) inside `define()`; read/write with `$state.key`; keys must be alphanumeric           |
| **$bind**                               | Map of methods assigned in `define()` for event attributes (e.g., `$bind.increment = () => {}; onclick="increment"`) |
| **$compute**                            | Define a derived state value in `define()`; signature `(key, sources, computation)`                                  |
| **$effect**                             | Register a side-effect in `define()`; callback may return a cleanup function                                         |
| **$ref**                                | Property-only API for accessing elements registered via `$ref` attributes inside `define()`                          |
| **$customBindingHandlers**              | Define custom binding handlers in `define()`; extends the binding system with custom logic                           |
| **Component Autonomy**                  | Encapsulation of state, lifecycle, and API within a custom element                                                   |
| **Single Source of Truth**              | Centralized, authoritative state per component                                                                       |
| **Unidirectional Data Flow**            | State updates propagate downward to bindings; events raise intentions upward                                         |

---

## 15. Meta: Guidelines for Updating AGENTS.md Files

### Helpful Additions

- **Decision flowchart**: When to initialize in HTML vs constructor
- **Reference links**: Pointers to authoritative examples demonstrating approved binding patterns
- **Terminology**: Keep glossary current with new concepts
- **Versioning**: Capture decisions affecting consumers

### Format Preferences

- Use clear headings and numbered sections for easy reference
- Favor tables or bullet lists for rules and checklists
- Include short, self-contained code examples that illustrate one concept at a time
- Tag sections with keywords when relevant (e.g., `#accessibility`, `#performance`)

---

## 16. Files to NOT Modify

### Introduction

These files control which files should be ignored by AI tools and indexing systems. **Never modify these ignore files** without explicit permission, as they're carefully configured to optimize IDE performance while ensuring all relevant code is properly indexed.

### File Definitions

| File                 | Purpose                                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@.agentignore`      | Files that should be ignored by AI tooling and editors (build outputs, env files, large data, generated docs, lock files, logs/caches, IDE files, binaries/media)            |
| `@.agentindexignore` | Files excluded from indexing to improve performance (includes everything from `.agentignore`, sensitive info, large JSON, generated artifacts, migrations, docker templates) |

> **Note**: When adding new files or directories, check these ignore patterns to ensure your files are properly included in indexing and AI assistance.

---

## 17. AI Assistant Workflow: Step-by-Step Methodology

### Introduction

When responding to instructions, follow this process to ensure clarity, correctness, and maintainability.

### Workflow Steps

| Step   | Action                        | Description                                                            |
| ------ | ----------------------------- | ---------------------------------------------------------------------- |
| **1**  | **Consult Relevant Guidance** | Read this AGENTS.md and any directory-specific AGENTS.md before acting |
| **2**  | **Clarify Ambiguities**       | Ask targeted questions if requirements are unclear                     |
| **3**  | **Break Down & Plan**         | Outline the approach; reference the HTML-first and binding rules       |
| **4**  | **Trivial Tasks**             | If trivial and low-risk, proceed                                       |
| **5**  | **Non-Trivial Tasks**         | Present the plan for review; wait for approval on significant changes  |
| **6**  | **Track Progress**            | Keep a to-do list for multi-step tasks                                 |
| **7**  | **If Stuck, Re-plan**         | Reassess and adjust the plan                                           |
| **8**  | **Update Documentation**      | Update anchor comments and AGENTS.md in touched directories            |
| **9**  | **User Review**               | Ask for review and iterate as needed                                   |
| **10** | **Session Boundaries**        | Suggest starting fresh if the request diverges from current context    |

---

## 18. Function-based Components with define()

Function-based components provide a concise alternative to class-based components. Register a component with `define(name, definition)`. The definition runs once per element instance and receives a context object for state, bindings, computed values, effects, and refs.

- HTML-first remains mandatory: structure and user-visible text live in HTML templates.
- Shares the same reactive engine as class-based components.
- Ideal for small/mid components and rapid prototyping.

### Context Object

Inside the definition function, you receive a single context object with:

- `$element`: The element instance (extends ReactiveComponent public wrappers)
  - Methods: `setState(key, value)`, `getState(key)`, `compute(key, deps, fn)`, `effect(fn)`, `refs`
- `$state`: Property-only state API (Proxy)
  - Read with `$state.key`, write with `$state.key = next`
  - Tracks keys actually used in bindings/computed values
  - Subject to binding constraints (alphanumeric keys only)
- `$compute(key, sources, computation)`: Define derived state
- `$effect(callback)`: Register an effect; may return a cleanup function
- `$ref`: Property-only API for accessing elements registered via `$ref` attributes
  - Access: `const el = $ref.refName`
- `$bind`: Bind methods onto the component instance for event attributes
  - Assign with `$bind.methodName = (...args) => { /* this === element */ }`
  - Use in HTML via `onclick="methodName"` or other `on*` attributes
- `$customBindingHandlers`: Define custom binding handlers for extending the binding system
  - Assign with `$customBindingHandlers["handler-name"] = ({ element, rawValue }) => { /* handler logic */ }`
  - Use in HTML via `$bind-handler-name="stateKey"`

All context methods are safe to call during definition execution.

### Lifecycle

The definition can return lifecycle hooks:

- `connected()`, `disconnected()`, `adopted()`, `attributeChanged(name, oldValue, newValue)`

### Interop and When to Use

- Works alongside class-based components; both use the same reactive engine.
- Prefer `define()` for:
  - Small to medium components without inheritance needs
  - Co-locating simple setup logic with the HTML
  - Quick prototyping with custom bindings
- Prefer class-based components for:
  - Advanced inheritance/mixins
  - Complex lifecycles or custom element internals
  - Components requiring extensive private methods

### Binding and Validation Rules

- Binding attribute values must be alphanumeric: `^[a-zA-Z0-9]+$` (no expressions/interpolation).
- Keep user-facing text in HTML templates.
- Manage state via `$state` or the `$element` wrappers; avoid direct DOM mutation for state changes.
- Event handlers reference `$bind`ed method names via `on*="methodName"`.

### Global Availability

- In the browser, `define` is also exposed on `window.define` for script-based usage.

### Practical Tips

- Prefer HTML initialization (`$state` placeholders) for simple values; use constructor/definition for dynamic values.
- Use `$compute` for derived values; keep computations pure and performant.
- Use `$effect` for side-effects (subscribe/unsubscribe in cleanup).
- Use `$ref` to reach DOM nodes when unavoidable, but keep state as the single source of truth.

## Appendix A: System Prompt Rules Mapped to Practice

### HTML-First Rule

- Always draft the full, semantic HTML structure (including all user-facing text) before TS/JS
- Request approval before implementing logic

### Binding Rules

- Only alphanumeric values allowed in `$`-prefixed attributes
- No expressions or interpolation in bindings; use computed properties
- On invalid binding: log, suggest correction, keep last valid state, fallback to defaults

### State Management Rules

- All state logic in TypeScript/JavaScript
- Avoid direct DOM manipulation for state changes; prefer state + bindings
- Keep TS/JS free of HTML/CSS and user-facing text

### Icons

- Use **Lucide Icons SVGs** for icons

---

## Appendix B: Examples

### Basic Counter

#### HTML

```html
<define-counter>
  <p>Count: <span $state="count">0</span></p>
  <button onclick="decrement">-</button>
  <button onclick="increment">+</button>
  <button onclick="reset">Reset</button>
</define-counter>
```

#### TypeScript

```typescript
define("define-counter", ({ $state, $bind }) => {
  // Initialize state
  $state.count = 0;

  // Bind methods
  $bind.increment = () => {
    $state.count++;
  };

  $bind.decrement = () => {
    $state.count--;
  };

  $bind.reset = () => {
    $state.count = 0;
  };
});
```

### Form Handling with Computed Props

#### HTML

```html
<form-demo>
  <div>
    <input type="checkbox" id="enabled" $bind-checked="isEnabled" />
    <label for="enabled">Enable input</label>
  </div>
  <input type="text" $bind-value="inputText" $bind-disabled="isDisabled" $bind-class="isInputValid" />
  <p $bind-text="status" $bind-class="isStatusValid"></p>
</form-demo>
```

#### TypeScript

```typescript
define("form-demo", ({ $state, $compute }) => {
  // Initialize form state
  $state.isEnabled = (document.getElementById("enabled") as HTMLInputElement)?.checked ?? false;
  $state.inputText = "";

  // Compute disabled state from isEnabled
  $compute("isDisabled", ["isEnabled"], (enabled: unknown) => !(enabled as boolean));

  // Compute status message with validation
  $compute("status", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
    if (!enabled) return "Input disabled";
    if ((text as string).length < 3) return "Input too short (min 3 characters)";
    return `Input active: ${(text as string).length} characters`;
  });

  // Track class binding for input validation styling
  $compute("isInputValid", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
    return { [(text as string).length >= 3 || !enabled ? "remove" : "add"]: "!border-red-500" };
  });

  // Track class binding for status validation styling
  $compute("isStatusValid", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
    return { [(text as string).length >= 3 || !enabled ? "remove" : "add"]: "!text-red-500" };
  });
});
```

### Temperature Converter (Computed-Only)

#### HTML

```html
<temperature-converter>
  <div>
    <label>Celsius:</label>
    <input type="number" $bind-value="celsius" />
    <p>Fahrenheit: <span $bind-text="fahrenheit"></span>°F</p>
    <p>Kelvin: <span $bind-text="kelvin"></span>K</p>
    <p>Temperature is: <span $bind-text="description"></span></p>
  </div>
</temperature-converter>
```

#### TypeScript

```typescript
define("temperature-converter", ({ $state, $compute }) => {
  $state.celsius = 20;
  $compute("fahrenheit", ["celsius"], (c) => ((c as number) * 9) / 5 + 32);
  $compute("kelvin", ["celsius"], (c) => (c as number) + 273.15);
  $compute("description", ["celsius"], (c) => {
    if ((c as number) <= 0) return "Freezing";
    if ((c as number) <= 20) return "Cool";
    if ((c as number) <= 30) return "Warm";
    return "Hot";
  });
});
```

### Custom Binding Handler (Progress)

#### HTML

```html
<custom-progress-binding class="p-4 border rounded block">
  <div class="flex flex-col gap-4 items-center">
    <h2>Custom Progress Binding Demo</h2>
    <progress class="w-full" $bind-progress="progressValue"></progress>
    <p $bind-text="loadingStatus"></p>
    <p class="flex">
      <button type="button" onClick="startProgress" $ref="startButton">Start Progress</button>
      <button type="button" onClick="stopProgress" $ref="stopButton">Stop Progress</button>
    </p>
  </div>
</custom-progress-binding>
```

#### TypeScript

```typescript
define("custom-progress-binding", ({ $state, $bind, $compute, $ref, $customBindingHandlers }) => {
  let progressInterval: number | null = null;

  $state.progressValue = 0;
  $state.status = "Starting...";

  $compute("loadingStatus", ["progressValue"], (value) => {
    if ((value as number) >= 100) return "Complete!";
    if ((value as number) > 0) return `Loading: ${value as number}%`;
    return "Starting...";
  });

  const updateButtonsState = (isRunning: boolean): void => {
    const startButton = $ref.startButton as HTMLButtonElement;
    const stopButton = $ref.stopButton as HTMLButtonElement;
    if (startButton) startButton.disabled = isRunning;
    if (stopButton) stopButton.disabled = !isRunning;
  };

  $customBindingHandlers.progress = ({ element, rawValue }) => {
    if (element instanceof HTMLProgressElement) {
      element.value = Number(rawValue) || 0;
      element.max = 100;
    }
  };

  $bind.startProgress = () => {
    let value = $state.progressValue && $state.progressValue !== 100 ? ($state.progressValue as number) : 0;
    if (progressInterval) {
      window.clearInterval(progressInterval);
    }
    updateButtonsState(true);
    progressInterval = window.setInterval(() => {
      if (value >= 100) {
        if (progressInterval) {
          window.clearInterval(progressInterval);
          progressInterval = null;
          updateButtonsState(false);
        }
      } else {
        value += 10;
        $state.progressValue = value;
      }
    }, 500);
  };

  $bind.stopProgress = () => {
    if (progressInterval) {
      window.clearInterval(progressInterval);
      progressInterval = null;
      updateButtonsState(false);
    }
  };
});
```

### Refs Demo

#### HTML

```html
<ref-demo>
  <p $ref="output">Initial Text</p>
  <input $ref="input" type="text" placeholder="Focus me" />
  <button onclick="updateText">Update Text</button>
  <button onclick="changeColor">Change Color</button>
  <button onclick="focusInput">Focus Input</button>
</ref-demo>
```

#### TypeScript

```typescript
define("ref-demo", ({ $state, $bind, $ref }) => {
  $state.dimensions = "Not measured yet";

  $bind.focusUsername = () => {
    const usernameInput = $ref.usernameInput as HTMLInputElement;
    usernameInput?.focus();
  };

  $bind.measureElement = () => {
    const measureBox = $ref.measureBox as HTMLDivElement;
    const rect = measureBox?.getBoundingClientRect();
    if (rect) {
      $state.dimensions = `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`;
    }
  };
});
```

### JSON State Manager

#### HTML

```html
<json-state-manager>
  <form>
    <div>
      <label for="name">Name:</label>
      <input id="name" $bind-value="name" />
    </div>
    <div>
      <label for="age">Age:</label>
      <input id="age" type="number" $bind-value="age" />
    </div>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" $bind-value="email" />
    </div>
  </form>
  <pre><code $bind-text="json"></code></pre>
</json-state-manager>
```

#### TypeScript

```typescript
define("json-state-manager", ({ $state, $compute }) => {
  $state.name = "John Doe";
  $state.age = 30;
  $state.email = "";
  $compute("json", ["name", "age", "email"], (name, age, email) =>
    JSON.stringify({ name, age, email }, null, 2),
  );
  $compute(
    "isValid",
    ["name", "email"],
    (name, email) =>
      (name as string).length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email as string),
  );
});
```

---

## Appendix C: Best Practices (State Management)

### Primary Approach: HTML State Initialization

Initialize simple, static state in HTML via `$state` placeholders for clarity and predictability.

```html
<my-counter>
  <div $state="count">0</div>
  <div $state="isEnabled">true</div>
  <div $state="userName">Guest</div>
</my-counter>
```

### Alternative Approach: Constructor Initialization

Initialize in constructor for complex/dynamic values (calculations, API calls, environment checks, computed initial values).

```typescript
class ComplexStateComponent extends ReactiveComponent {
  constructor() {
    super();
    this.setState("randomId", Math.random().toString(36));
    this.setState("windowWidth", window.innerWidth);
    this.setState("timestamp", Date.now());
    this.setState("isDarkMode", window.matchMedia("(prefers-color-scheme: dark)").matches);
    this.setState("userData", null);
    this.setState("config", {
      theme: "light",
      language: navigator.language,
      features: {},
    });
  }
}
customElements.define("complex-state", ComplexStateComponent);
```

### Decision Guidelines

1. **Prefer HTML initialization** for simple, static values
2. **Use constructor initialization** when HTML is impractical
3. **Document why** constructor initialization was chosen
4. **Keep initialization separate** from business logic
5. **Consider async initialization** for API-dependent state

### Performance

Use computed properties for derived state to avoid unnecessary recalculations.

```typescript
this.compute("doubleCount", ["count"], (count) => count * 2);
```

---

_This document serves as the authoritative guide for all development work on the reactive-component project. Please keep it updated as the project evolves._
