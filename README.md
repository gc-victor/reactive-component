# Reactive Component

Reactive Component is a lightweight library for building modern web components with native standards. It extends the Custom Elements API by adding a signal-based reactive system for declarative DOM manipulation and precise state management. Using simple directives like `$state` and `$bind-*,` you can easily bind the component state to the DOM, keeping your UI in sync with changes.

This HTML-first approach lets you work directly with your existing markup—there is no need for virtual DOM diffing, heavy templating, or build steps. Computed properties and automatic dependency tracking handle updates, so you can focus on your app’s logic.

In summary, Reactive Component offers reactive state management and declarative data binding in a simple, standards-compliant way—without the complexity of larger frameworks.

**Important — Authoritative Prompt:** See [prompt.txt](./prompt.txt) for the HTML-first workflow, strict binding validation, security guidance, and AI usage rules.

## Features

- Reactive: Automatically update the DOM when the state changes.
- Computed: Instantly refresh derived values.
- Declarative Binding: Keep UI and data in sync with minimal code.
- Zero Build: Use plain HTML and Custom Elements, no bundlers needed.
- Progressive Enhancement: Boost SEO, speed up initial loads, and simplify maintenance.
- High Performance: Direct DOM updates in a ~4.8KB gzipped package.
- TypeScript: Benefit from type safety and smarter tooling.
- Framework Agnostic: Easily integrate with other libraries or legacy systems.
- Context API: Share state between components in a clean, React-like way.

## Credits

- [Hawk Ticehurst's](https://github.com/hawkticehurst) work on [Stellar](https://github.com/hawkticehurst/stellar) and his article ['Declarative Signals'](https://hawkticehurst.com/2024/12/declarative-signals/) inspired this library.

- [Ginger](https://github.com/gingerchew) for the article ['Functional custom elements the easy way'](https://piccalil.li/blog/functional-custom-elements-the-easy-way/), which inspired the `define` functionality.

## Installation

```bash
# Using pnpm (recommended)
pnpm install @qery/reactive-component
```

Or

```bash
# Using npm
npm install @qery/reactive-component
```

## Quick Start

Let's start with a simple counter component that demonstrates several core reactive features:

### Key Features Demonstrated:

1. Function-based Component Definition
   - Use `define()` to create components with a concise API
   - All state and behavior managed through the context object
   - Clean, minimal syntax for small to medium components

2. Automatic State Management
   - The `$state` proxy automatically tracks and manages state
   - Changes trigger efficient DOM updates
   - Property-based API for reading and writing state

3. Method Binding
   - `$bind` maps methods for use in HTML event handlers
   - Methods are automatically bound to the component instance
   - Clean event handler syntax

4. State Initialization + Reactive Display
   - `$state` initializes state keys from the element's initial text content
   - After initialization it is one-way: state updates the DOM
   - User edits do not propagate back (not two-way)

Here's the complete example:

```javascript
define("basic-counter", ({ $state, $bind }) => {
  // Initialize state
  $state.count = 0;

  // Bind methods for event handlers
  $bind.increment = () => {
    $state.count++;
  };

  $bind.decrement = () => {
    $state.count--;
  };
});
```

```html
<basic-counter>
  <!-- $state initializes `count` from HTML (0) then one-way reflects state updates -->
  <p>Count: <span $state="count">0</span></p>

  <!-- onclick attribute references bound methods by name -->
  <button onclick="decrement" class="bg-blue-500 text-white px-4 py-2 rounded">Decrement</button>
  <button onclick="increment" class="bg-blue-500 text-white px-4 py-2 rounded">Increment</button>
</basic-counter>
```

### Implementation Details:

1. Component Definition
   - `define()` registers the custom element
   - Context object provides `$state`, `$bind`, `$compute`, `$effect`, `$ref`
   - Definition runs once per element instance

2. State Management
   - `$state.count` provides direct property access
   - Changes are automatically tracked and trigger DOM updates
   - Binding attribute values must be alphanumeric

3. Template Structure
   - `$state="count"` initializes the counter (0) then one-way reflects state
   - `onclick` handlers reference method names from `$bind`
   - Tailwind classes provide styling without extra CSS

## Core Concepts

1. State Management - Reactive state that automatically updates the UI
2. Computed Properties - Derived values that update when dependencies change
3. Context API - Share state between components without prop drilling

### State Management

The component uses a sophisticated signal-based reactive system for efficient state management that provides several powerful features:

1. Declarative State Initialization
   - States are initialized using `setState()` with automatic type inference
   - Values can be primitives, objects, or complex data structures
   - State changes trigger efficient, granular re-renders

2. Computed Properties with Auto-Tracking
   - Derived values update automatically when dependencies change
   - Smart caching prevents unnecessary recalculations
   - Dependencies are tracked without explicit declarations

3. DOM Binding Modes
   - `$state`: initialization + one-way (state → DOM)
   - `$bind-text`, `$bind-class`, `$bind-attr`: one-way (state → DOM)
   - `$bind-value`, `$bind-checked`: two-way (form control ↔ state)

Here's a practical example showing these features in action:

```javascript
define("input-echo", ({ $state, $compute }) => {
  // Initialize reactive state with empty string
  $state.text = "";

  // Create a computed property that transforms text to uppercase
  // Updates automatically when text changes
  $compute("uppercase", ["text"], (c) => String(c).toUpperCase());
});
```

```html
<input-echo>
  <!-- Two-way binding syncs input value with text state -->
  <input type="text" $bind-value="text" class="border p-2 w-full mb-2" placeholder="Type something..." />

  <!-- Displays computed uppercase value -->
  <!-- Updates automatically when text changes -->
  <p>You typed: <span $bind-text="uppercase" /></p>
</input-echo>
```

Key Features Demonstrated:

- Automatic state synchronization between input and component
- Computed properties that transform state (`uppercase`)
- Efficient updates that only re-render affected parts
- Clean, declarative syntax for complex reactivity

### Computed Properties

Computed properties are a powerful feature that enables you to create derived state values that automatically update based on changes to their dependencies. This reactive computation system provides several key benefits:

**Note:** Calling `this.compute()` more than once with the same property name will log a warning in the console, as it indicates a potential logic error.

1. Automatic Dependency Tracking
   - The system intelligently tracks dependencies between state values
   - Only recomputes when dependent values change
   - Eliminates unnecessary calculations and improves performance

2. Smart Caching
   - Computed values are cached until dependencies change
   - Prevents recalculating the same value multiple times
   - Optimizes memory usage and computation time

3. Declarative Data Flow
   - Define transformations as pure functions
   - Dependencies are automatically managed
   - Results update seamlessly when source data changes

Here's a practical example of computed properties in action with a temperature converter:

```javascript
define("temperature-converter", ({ $state, $compute }) => {
  // Initialize base temperature in Celsius
  $state.celsius = 20;

  // Compute Fahrenheit from Celsius
  // Updates automatically when celsius changes
  $compute("fahrenheit", ["celsius"], (c) => {
    // Standard C to F conversion formula
    return ((c as number) * 9) / 5 + 32;
  });
});
```

```html
<temperature-converter>
  <div class="space-y-2">
    <!-- Base temperature initialized via $state (one-way thereafter) -->
    <p>Celsius: <span $state="celsius">20</span>°C</p>

    <!-- Computed temperatures update automatically -->
    <p>Fahrenheit: <span $bind-text="fahrenheit" />°F</p>

    <!-- Interactive slider updates celsius state (two-way) -->
    <input type="range" min="0" max="40" $bind-value="celsius" class="w-full" />
  </div>
</temperature-converter>
```

Key Features Demonstrated:

- Automatic updates when source data changes
- Multiple computed properties from a single source
- Built-in caching and performance optimization
- Clean separation of computation logic
- Declarative template bindings

## Advanced Features

### Element References

Element references provide direct, type-safe access to DOM elements in your components. This feature enables efficient manipulation of DOM elements while maintaining reactivity and encapsulation.

1. Direct Element Access
   - Direct access to DOM elements through the `$ref` function
   - Refs are populated at runtime after the component connects to the DOM
   - Always check for a ref's existence before using it

2. Ref Registration
   - Elements marked with `$ref` attribute are automatically registered
   - References are available immediately after component mounting
   - Clean separation between template and logic
   - **Dynamic Refs:** Refs on elements dynamically added after initial connection are recognized and available via `$ref`. However, it's recommended to define refs in your initial HTML for better performance and predictability.

3. Reactive Integration
   - Refs work seamlessly with reactive state
   - Changes through refs trigger appropriate updates
   - Maintains the component's reactive nature

Here's a practical example demonstrating element references:

```javascript
define("ref-demo", ({ $state, $bind, $ref }) => {
  // Initialize state
  $state.dimensions = "Not measured yet";

  // Use Case 1: Focus Management
  $bind.focusUsername = () => {
    const usernameInput = $ref.usernameInput as HTMLInputElement;
    usernameInput?.focus();
  };

  // Use Case 2: DOM Measurements
  $bind.measureElement = () => {
    const measureBox = $ref.measureBox as HTMLDivElement;
    const rect = measureBox?.getBoundingClientRect();
    if (rect) {
      $state.dimensions = `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`;
    }
  };
});
```

```html
<ref-demo>
  <div class="space-y-4">
    <p>Click buttons to interact with referenced elements:</p>
    <!-- Element referenced using $ref attribute -->
    <input $ref="usernameInput" type="text" placeholder="Enter username" class="border p-2" />
    <div $ref="measureBox" class="p-4 border rounded bg-gray-100">
      <p>This box can be measured</p>
    </div>
    <p>Dimensions: <span $bind-text="dimensions"></span></p>
    <div class="flex justify-center space-x-4">
      <!-- Event handlers trigger ref-based operations -->
      <button onclick="focusUsername" class="bg-purple-500 text-white px-4 py-2 rounded">Focus Input</button>
      <button onclick="measureElement" class="bg-pink-500 text-white px-4 py-2 rounded">Measure Box</button>
    </div>
  </div>
</ref-demo>
```

Key Features Demonstrated:

- Simple element referencing with `$ref` attribute
- Direct access to DOM methods and properties
- Integration with component state management
- Clean separation of concerns between template and logic
- Type-safe element manipulation
- Automatic reference management
- Event handling with referenced elements

### JSON State Management

The JSON State Management feature provides sophisticated handling of complex data structures with automatic serialization and reactive updates. Here's a detailed breakdown of its capabilities:

1. Automated JSON Serialization
   - Automatic conversion between JS objects and JSON
   - Pretty-printing with proper indentation
   - Type-safe serialization of complex nested structures

2. Deep Reactivity
   - Changes to nested properties trigger updates
   - Computed properties track deep dependencies
   - Metadata automatically updates on state changes

3. Form Integration
   - Two-way binding with form inputs
   - Real-time validation and feedback
   - Automatic type coercion for form fields

Here's a practical example demonstrating JSON state management:

```javascript
define("json-state-management", ({ $state, $compute }) => {
  // Initialize form field states
  $state.name = "Paco Doe";
  $state.age = 30;
  $state.bio = "";

  // Create computed JSON representation
  // Updates automatically when any dependency changes
  $compute("json", ["name", "age", "bio"], (name, age, bio) =>
    JSON.stringify(
      {
        name,
        age,
        bio,
      },
      null,
      2,
    ),
  );
});
```

```html
<json-state-management>
  <div class="space-y-4">
    <div>
      <!-- Two-way binding for name field -->
      <label for="name" class="block mb-1">Name:</label>
      <input id="name" type="text" $bind-value="name" class="border p-2 w-full" />
    </div>
    <div>
      <!-- Numeric input with automatic type coercion -->
      <label for="age" class="block mb-1">Age:</label>
      <input id="age" type="number" $bind-value="age" class="border p-2 w-full" />
    </div>
    <div>
      <!-- Multi-line text input with two-way binding -->
      <label for="bio" class="block mb-1">Bio:</label>
      <textarea id="bio" $bind-value="bio" class="border p-2 w-full h-24"></textarea>
    </div>
    <div>
      <!-- Live JSON preview with automatic updates -->
      <p>JSON Output:</p>
      <pre class="bg-gray-100 p-2 rounded mt-1">
                <code $bind-text="json"></code>
            </pre>
    </div>
  </div>
</json-state-management>
```

Key Features Demonstrated:

- Deep reactive state management with nested objects
- Automatic JSON serialization and formatting
- Real-time form input synchronization
- Computed metadata updates
- Type-safe state handling
- Clean separation of data and presentation
- Automatic dependency tracking

### Context API

Context provides a way to share values between components without having to explicitly pass a prop through every level of the component tree. This feature is particularly useful for sharing global state such as themes, user data, or application configuration.

1. Creating Context
   - Define shared state using the `createContext` function
   - Provide a state key for storage and an optional debug name
   - Context is identified by a unique symbol to prevent collisions

2. Exposing Context
   - Provider components expose context using `exposeContext(context)`
   - State changes in provider components automatically update consumers
   - Multiple contexts can be exposed from a single component

3. Consuming Context
   - Child components consume context using `consumeContext(context)`
   - Consumed context is automatically synchronized with provider updates
   - Components can consume multiple contexts from different providers

Here's an example of a theme context system:

```typescript
// Define context and provider component
const themeContext = createContext("theme");

class ThemeProvider extends ReactiveComponent {
  constructor() {
    super();
    // Initialize state
    this.setState("theme", {
      mode: "light",
      background: "bg-slate-200",
      text: "text-slate-900",
    });

    // Expose the theme context
    this.exposeContext(themeContext);
  }

  toggleTheme() {
    const currentTheme = this.getState("theme");
    // Toggle between light and dark mode
    this.setState(
      "theme",
      currentTheme.mode === "light"
        ? { mode: "dark", background: "bg-slate-900", text: "text-slate-50" }
        : { mode: "light", background: "bg-slate-200", text: "text-slate-900" },
    );
  }
}
customElements.define("theme-provider", ThemeProvider);

// Consumer component
class ThemeConsumer extends ReactiveComponent {
  constructor() {
    super();

    // Consume the theme context
    this.consumeContext(themeContext);

    // Create computed properties based on the theme
    this.compute("themeMode", [themeContext.state], (theme) => `ThemeMode: ${theme.mode}`);
  }

  connectedCallback() {
    super.connectedCallback();

    // React to theme changes
    this.effect(() => {
      const theme = this.getState("theme");
      this.classList.add(theme.background, theme.text);
      this.refs.themeInfo.textContent = `Current Theme: ${theme.mode}`;
    });
  }
}
customElements.define("theme-consumer", ThemeConsumer);
```

```html
<theme-provider>
  <button type="button" onclick="toggleTheme">Toggle Theme</button>
  <theme-consumer>
    <p $bind-text="themeMode"></p>
    <p $ref="themeInfo"></p>
  </theme-consumer>
</theme-provider>
```

Key Features Demonstrated:

- Clean provider/consumer pattern for shared state
- Automatic propagation of state changes
- Type-safe context consumption
- Computed properties based on context values
- Nested component communication without prop drilling
- Reactive UI updates when context changes

### Form Handling

Form handling in ReactiveComponent provides sophisticated validation, state management, and real-time feedback capabilities. Here's a detailed breakdown of its features:

1. Reactive Form State Management
   - Automatic two-way data binding for form inputs
   - Real-time validation and error handling
   - Dynamic enable/disable functionality
   - Status tracking and feedback

2. Smart Validation System
   - Built-in validation rules and custom validators
   - Real-time validation feedback
   - Computed validation states
   - Error message management

3. Accessibility Integration
   - Keyboard navigation support
   - Screen reader-friendly status messages
   - Focus management

Here's a practical example demonstrating form-handling capabilities:

```javascript
class FormDemo extends ReactiveComponent {
  constructor() {
    super();
    // Initialize form state with defaults
    this.setState("isEnabled", false);
    this.setState("inputText", "");

    // Compute disabled state from isEnabled
    // Updates automatically when enabled state changes
    this.compute("isDisabled", ["isEnabled"], (enabled) => !enabled);

    // Compute status message with validation
    // Re-computes when either input text or enabled state changes
    this.compute("status", ["isEnabled", "inputText"], (enabled, text) => {
      if (!enabled) return "Input disabled";
      if (text.length < 3) return "Input too short (min 3 characters)";
      return `Input active: ${text.length} characters`;
    });

    // Track validation state
    // Updates when is enabled and the input text changes
    this.compute("isStatusValid", ["isEnabled", "inputText"], (enabled, text) => {
      return { [text.length >= 3 || !enabled ? "remove" : "add"]: "text-red-500" };
    });
  }
}
customElements.define("form-demo", FormDemo);
```

```html
<form-demo>
  <div class="space-y-4">
    <!-- Toggle input enabled/disabled state -->
    <div>
      <input type="checkbox" id="enabled" $bind-checked="isEnabled" class="mr-2" />
      <label for="enabled">Enable input</label>
    </div>

    <!-- Input field with validation -->
    <div>
      <input
        type="text"
        $bind-value="inputText"
        $bind-disabled="isDisabled"
        class="border p-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder="Type when enabled..."
        aria-describedby="status"
      />
    </div>

    <!-- Status message with validation styling -->
    <p id="status" role="status">Status: <span $bind-text="status" $bind-class="className"> </span></p>
  </div>
</form-demo>
```

Key Features Demonstrated:

- Two-way data binding for form inputs
- Real-time validation with computed properties
- Dynamic enable/disable functionality
- Status messages with validation styling
- Clean separation of form logic and presentation
- Reactive updates without explicit event handling

### Attribute Binding (`$bind-attr`)

The `$bind-attr` binding manages multiple element attributes dynamically from a single state object.

**State Shape:**

```typescript
this.setState("buttonAttrs", {
  "data-id": "user-123", // Sets attribute
  "aria-label": "Submit Form",
  hidden: false, // Removes 'hidden' attribute
  disabled: true, // Adds 'disabled' attribute
  title: null, // Removes 'title' attribute
});
```

**HTML:**

```html
<button $bind-attr="buttonAttrs">Submit</button>
```

**Rules:**

- A truthy value sets the attribute. `true` results in an empty attribute (e.g., `disabled`).
- A falsy value (`false`, `null`, `undefined`, `""`) removes the attribute.

### Class Binding (`$bind-class`)

`$bind-class` operates on a state object that specifies `add`, `remove`, `toggle`, or `replace` operations. It does not work with simple strings or booleans.

**State Shape:**

```typescript
this.setState("panelClasses", {
  add: ["panel", "active"], // Add one or more classes
  remove: "loading", // Remove a class
  toggle: "highlighted", // Toggle a class
  replace: ["old-style", "new-style"], // Replace a class
});
```

**HTML:**

```html
<div $bind-class="panelClasses">...</div>
```

**Note:** Operations are cumulative. Classes added in a previous state update will persist unless explicitly removed.

### Custom Binding Handlers

Custom binding handlers allow you to extend the component's binding capabilities with your own custom logic. This powerful feature enables specialized DOM updates based on state changes.

1. Handler Definition
   - Register custom handlers using `$customBindingHandlers`
   - Assign handler functions for each binding type
   - Access element and value details for fine-grained control

2. Handler Execution
   - Automatically called when bound state changes
   - Receives element and raw state values
   - Full access to elements for direct DOM manipulation

3. Integration with State System
   - Works seamlessly with reactive state management
   - Handlers are reactive and update automatically
   - Clean integration with the existing binding system

Here's a practical example of custom binding handlers:

```typescript
define("custom-binding-demo", ({ $state, $bind, $customBindingHandlers }) => {
  // Initialize state for various custom bindings
  $state.counter = 0;
  $state.theme = "light";
  $state.status = "idle";

  // Custom handler for counter animation
  $customBindingHandlers["animate-count"] = ({ element, rawValue }) => {
    if (element && typeof rawValue === "number") {
      element.style.transform = `scale(${1 + rawValue * 0.1})`;
      element.textContent = String(rawValue);
    }
  };

  // Custom handler for theme switching
  $customBindingHandlers["theme-switch"] = ({ element, rawValue }) => {
    if (element && rawValue) {
      const theme = String(rawValue);
      element.classList.remove("theme-light", "theme-dark");
      element.classList.add(`theme-${theme}`);
      element.setAttribute("aria-theme", theme);
    }
  };

  // Custom handler for status indicators
  $customBindingHandlers["status-indicator"] = ({ element, rawValue }) => {
    if (element && rawValue) {
      const status = String(rawValue);
      element.setAttribute("data-status", status);
      element.setAttribute("aria-busy", status === "loading" ? "true" : "false");
      element.classList.toggle("pulse", status === "active");
    }
  };

  // Bind methods to update state
  $bind.increment = () => {
    $state.counter = ($state.counter as number) + 1;
  };

  $bind.toggleTheme = () => {
    $state.theme = $state.theme === "light" ? "dark" : "light";
  };

  $bind.updateStatus = (e: Event) => {
    const target = e.currentTarget as HTMLButtonElement;
    $state.status = target.textContent?.toLowerCase() || "idle";
  };
});
```

```html
<custom-binding-demo>
  <div class="space-y-4">
    <!-- Animated counter binding -->
    <div>
      <span $bind-animate-count="counter" class="text-2xl font-bold transition-transform"> 0 </span>
      <button onclick="increment" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Increment</button>
    </div>

    <!-- Theme switching binding -->
    <div $bind-theme-switch="theme" class="p-4 border rounded transition-colors">
      <h3>Theme Demo</h3>
      <button onclick="toggleTheme" class="px-4 py-2 bg-gray-200 rounded">Toggle Theme</button>
    </div>

    <!-- Status indicator binding -->
    <div $bind-status-indicator="status" class="p-2 border rounded">
      <p>Current Status: <span $bind-text="status"></span></p>
      <div class="flex space-x-2 mt-2">
        <button onclick="updateStatus('idle')" class="px-3 py-1 bg-gray-500 text-white rounded">Idle</button>
        <button onclick="updateStatus('active')" class="px-3 py-1 bg-green-500 text-white rounded">Active</button>
        <button onclick="updateStatus('loading')" class="px-3 py-1 bg-yellow-500 text-white rounded">Loading</button>
      </div>
    </div>
  </div>
</custom-binding-demo>
```

Key Features Demonstrated:

- Custom animation binding with state-based scaling
- Theme switching with dynamic class management
- Multiple custom bindings in a single component
- Clean integration with an existing state system
- Reactive updates without manual event handling
- Accessibility considerations in custom bindings

## Function-based Components with define()

In addition to class-based components, Reactive Component supports concise function-based components via `define(name, definition)`. This style keeps logic close to the HTML and offers a minimal API through a context object.

- HTML-first remains the rule: structure and user-visible text live in HTML.
- All state and behavior are managed through the `define()` context.
- Ideal for small/mid components and rapid prototyping.

### Basic Usage

```typescript
define("rc-counter", function Counter({ $state, $bind, $effect, $compute, $ref }) {
  // Initialize state (property-only API)
  $state.count = 0;

  // Bind methods as event handlers (auto-bound to the element)
  $bind.increment = () => {
    $state.count = ($state.count as number) + 1;
  };

  // Computed values
  $compute("doubleCount", ["count"], (count) => (count as number) * 2);

  // Effects
  $effect(() => {
    console.log("Count changed:", $state.count);
  });

  // Refs
  $bind.focusInput = () => {
    const input = $ref.countInput;
    input?.focus();
  };

  // Optional lifecycle hooks
  return {
    connected: () => console.log("Counter connected!"),
  };
});
```

```html
<rc-counter>
  <p>Count: <span $state="count">0</span></p>
  <p>Double: <span $bind-text="doubleCount"></span></p>
  <input $ref="countInput" type="number" $bind-value="count" />
  <button onclick="increment">Increment</button>
  <button onclick="focusInput">Focus Input</button>
</rc-counter>
```

Notes:

- Event handlers reference `$bind`ed methods by name via `onclick="methodName"`.
- Use `$state.someKey` to read/write state. The binding attributes must use alphanumeric keys.

### Context API

Inside the definition function you receive a single `context` object:

- `$element`: The component instance. Extends ReactiveComponent with public wrappers:
  - `setState(key, value)`, `getState(key)`, `compute(key, deps, fn)`, `effect(fn)`, `refs`
- `$state`: Property-only state API exposed via Proxy
  - Read: `const v = $state.key`
  - Write: `$state.key = next`
  - Tracks keys that are actually used in bindings and computed values
- `$compute(key, sources, computation)`: Define a derived state value
- `$effect(callback)`: Register an effect; returns a cleanup function
- `$ref`: Property-only API for accessing elements registered via `$ref` attributes
  - Access: `const el = $ref.refName`
- `$bind`: Bind functions onto the component instance
  - Assign: `$bind.methodName = (...args) => { /* this === element */ }`
  - Use in HTML: `onclick="methodName"`
- `$customBindingHandlers`: Define custom binding handlers for extending the binding system
  - Assign: `$customBindingHandlers["handler-name"] = ({ element, rawValue }) => { /* handler logic */ }`
  - Use in HTML: `$bind-handler-name="stateKey"`

All methods are safe to call during definition execution.

### Lifecycle

You can return lifecycle hooks from your `definition`:

```typescript
define("rc-lifecycle", function WithLifecycle({ $state }) {
  $state.label = "Hello";

  return {
    connected: () => console.log("connected"),
    disconnected: () => console.log("disconnected"),
    adopted: () => console.log("adopted"),
    attributeChanged: (name, oldValue, newValue) => {
      if (name === "label" && newValue != null) $state.label = newValue;
    },
  };
});
```

```html
<rc-lifecycle label="Welcome">
  <span $bind-text="label"></span>
</rc-lifecycle>
```

Details:

- `return { connected, disconnected, adopted, attributeChanged }` is optional.
- `attributeChanged(name, oldValue, newValue)` fires when an observed attribute changes.

### Custom Binding Handlers

You can extend the binding system with custom handlers using `$customBindingHandlers`:

```typescript
define("tab-component", function TabComponent({ $state, $customBindingHandlers, $bind }) {
  $state.activeTab = "tab1";

  // Define custom binding handler for tab triggers
  $customBindingHandlers["tab-trigger"] = ({ element, rawValue }) => {
    if (!(element instanceof HTMLElement)) return;
    const name = element.dataset.name;
    if (!name) return;

    const isActive = rawValue === name;
    element.setAttribute("aria-selected", isActive ? "true" : "false");
    element.tabIndex = isActive ? 0 : -1;
  };

  $bind.selectTab = (e: Event) => {
    const target = e.currentTarget as HTMLElement;
    $state.activeTab = target.dataset.name || "tab1";
  };
});
```

```html
<tab-component>
  <div role="tablist">
    <button role="tab" data-name="tab1" $bind-tab-trigger="activeTab" onclick="selectTab">Tab 1</button>
    <button role="tab" data-name="tab2" $bind-tab-trigger="activeTab" onclick="selectTab">Tab 2</button>
    <button role="tab" data-name="tab3" $bind-tab-trigger="activeTab" onclick="selectTab">Tab 3</button>
  </div>
  <div role="tabpanel">
    <p>Active Tab: <span $bind-text="activeTab"></span></p>
  </div>
</tab-component>
```

### Interop and When to Use define()

- Works alongside class-based components; both use the same reactive engine.
- Choose `define()` for:
  - Small to medium components
  - Components without inheritance needs
  - Co-locating simple setup logic with HTML
  - Quick prototyping with custom bindings
- Choose class-based for:
  - Advanced inheritance / mixins
  - Complex lifecycles or custom element internals
  - Components requiring extensive private methods
- Global availability: when running in a browser, `window.define` is set for script-based usage.

## Value Coercion

When a component initializes, text content from elements with `$state` is automatically coerced into a JavaScript type. The runtime applies these deterministic rules (evaluated in the order below):

| Input from HTML                                 | Coerced Type       | Notes / Example                                   |
| ----------------------------------------------- | ------------------ | ------------------------------------------------- |
| `"true"`                                        | `boolean`          | true                                              |
| `"false"`                                       | `boolean`          | false                                             |
| `"42"`, `"-10.5"`                               | `number`           | 42, -10.5                                         |
| `"null"`                                        | `null`             | null                                              |
| `"undefined"`                                   | `string`           | the literal string `"undefined"` - see note below |
| Strings starting with `{` or `[` and valid JSON | `object` / `array` | parsed via `JSON.parse`                           |
| Other                                           | `string`           | preserved as-is                                   |

Important details and guidance:

- The implementation treats the token `"undefined"` as the literal string `"undefined"` (it does **not** coerce it to the JavaScript `undefined` value). Avoid using `"undefined"` as a sentinel in markup; omit the attribute or use `null` / an explicit value instead.
- JSON parsing is attempted only when the string begins with `{` or `[` and valid JSON is present. Invalid JSON will remain a string.
- **Note:** Coercion is automatically applied in the following scenarios:
  1. When extracting initial values from `$state` elements in HTML
  2. On every `setState(key, value)` call
  3. On every computed property result from `compute()`

  This means `setState("count", "42")` will store the **number** `42`, not the string.

- These coercion rules are deterministic and intentionally conservative to avoid surprising application behavior (for example, `"0"` becomes the number `0`, but `"undefined"` remains a string).

AIDEV-NOTE: Make UI/markup explicit instead of relying on `"undefined"`; prefer omitting attributes or using `null` / explicit JSON for complex values.

## Binding Validation Rules

To ensure predictable behavior, security, and fast parsing, the runtime enforces strict validation on `$`-prefixed bindings. Bindings must be simple identifiers (no expressions, interpolation, or punctuation). Violations are considered errors and will be logged; the runtime will keep the last valid state and fall back to safe defaults.

| Aspect / Target                               | Attribute Pattern                                 | Allowed Pattern (Regex) | Notes                                                                            |
| --------------------------------------------- | ------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------- |
| Binding type (e.g. `bind-<type>`)             | `$bind-<type>="key"`                              | `/^[a-zA-Z0-9-]+$/`     | Hyphens allowed in the binding type (e.g. `$bind-animate-count`, `$bind-custom`) |
| Binding value (state key / ref / $state name) | `$state="key"`, `$ref="name"`, `$bind-text="key"` | `/^[a-zA-Z0-9]+$/`      | Strict alphanumeric state key; no dots, brackets, or operators                   |
| Ref name                                      | `$ref="name"`                                     | `/^[a-zA-Z0-9]+$/`      | Alphanumeric only                                                                |

Validation guidance:

- Binding attribute values must be a single alphanumeric token matching `^[a-zA-Z0-9]+$`. Do not embed expressions like `user.name`, `items[0]`, or templates like `${value}`.
- Binding types (the `<type>` part of `$bind-<type>`) may include hyphens and therefore use the looser pattern `/^[a-zA-Z0-9-]+$/`.
- On invalid bindings the runtime will:
  1. Log a descriptive validation error with the element, attribute, and offending value.
  2. Suggest a corrected form (e.g., replace dots with a single key or rename the key).
  3. Preserve the component's last-known-good state and fall back to a safe default display.

### Form Input Gotchas

#### Checkboxes

- Use `$bind-checked` for boolean state on checkboxes.
- Avoid `$bind-value` with checkboxes — the library will warn and may not behave as expected.

#### Radio Buttons

- Use `$bind-value` to bind to the `value` of the selected radio in a group.
- Avoid `$bind-checked` for radio groups (will trigger a warning).
- Requirement: all radios in a group must share the same `name` attribute.
- Note: When the state bound to a radio group changes, radio inputs with the same `name` are updated automatically to reflect the new selection.

NOTE: If your binding needs fall outside these patterns (complex paths, computed expressions), expose a simple computed state key (with `$compute`) instead of embedding expressions in markup.

## Security Best Practices

### HTML and Custom Bindings

The library prioritizes performance and flexibility, which means it does **not** include built-in sanitization for HTML content. You are responsible for sanitizing any untrusted data.

#### `$bind-html`

Never use `$bind-html` with user-provided content without sanitizing it first.

**Unsafe:**

```typescript
this.userComment = "<img src=x onerror=alert('XSS')>"; // Malicious input
```

```html
<!-- This is vulnerable to XSS -->
<div $bind-html="userComment"></div>
```

**Safe (with a library like DOMPurify):**

```typescript
import DOMPurify from "dompurify";
this.userComment = DOMPurify.sanitize("<img src=x onerror=alert('XSS')>");
```

```html
<!-- Sanitized and safe -->
<div $bind-html="userComment"></div>
```

#### Custom Binding Handlers

Be equally cautious in `customBindingHandlers`. Manipulating the DOM with `innerHTML`, or setting `href` attributes from untrusted state can also lead to XSS. Always validate and sanitize data within your custom handlers.

## API Reference

### Function-based define API

- `define(name: string, definition: Definition): typeof HTMLElement`
  - Registers a custom element using the function-based API.
  - Returns the custom element constructor.

Definition:

- `interface Definition`
  - Call signature: `(this: Element, context: Context) => unknown`
  - Can return `Partial<LifecycleMethods>`:
    - `{ connected?, disconnected?, adopted?, attributeChanged?(name, oldValue, newValue) }`

Context:

- `$element: Element` — The element instance with public wrappers:
  - `setState(key, value)`, `getState(key)`, `compute(key, deps, fn)`, `effect(fn)`, `refs`
- `$state: Record<string, any>` — Property-only state API (Proxy)
- `$compute(key: string, sources: string[], computation: (...args) => StateValue): void`
- `$effect(callback: () => void): () => void`
- `$ref: Record<string, HTMLElement | undefined>` — Property-only API for accessing registered refs
- `$bind: Record<string, ((...args: unknown[]) => unknown) | undefined>`
  - Assign functions to add methods onto the element instance

Notes:

- Binding constraints apply: binding attribute values must be alphanumeric (no expressions).
- All user-visible text should live in HTML templates.

### Component Lifecycle

- `connectedCallback()`: Called when the component is added to the DOM
- `disconnectedCallback()`: Called when the component is removed from the DOM
- `attributeChangedCallback(name, oldValue, newValue)`: Called when an observed attribute changes

### State Methods

- `setState(key: string, value: unknown)`: Initialize or update state with automatic type coercion
- `getState(key: string)`: Retrieve current state value with type safety
- `compute(key: string, dependencies: string[], computation: Function)`: Create computed property with dependency tracking
- `effect(callback: Function)`: Create a side effect that runs when dependencies change. The callback may return a cleanup function that will be called when the component is disconnected from the DOM
- `customBindingHandlers({ stateKey, element, formattedValue, rawValue }: { stateKey?: string; element?: HTMLElement; formattedValue?: string; rawValue?: StateValue }): Record<string, () => void>`: Override to add custom binding handlers for state updates. All parameters are optional.

### Context Methods

- `createContext(stateKey: string)`: Create a new context object for sharing state between components
- `exposeContext(context: Context)`: Expose state to child components through a context provider
- `consumeContext(context: Context)`: Subscribe to a context from a parent component

### Element Processing

Processes an element's attributes for special bindings and state declarations. This method is responsible for:

1. Reference Processing
   - Handles `$ref` attributes to create element references
   - Populates the component's `refs` object
   - Automatically removes ref attributes after processing

2. State Declaration Processing
   - Process `$state` attributes for direct state declarations
   - Extracts initial values from element content
   - Establishes state-to-element bindings
   - Removes state declaration attributes

3. Binding Setup
   - Handles `$bind-*` attributes for two-way data binding
   - Establishes appropriate event listeners for form elements
   - Sets up validation and type coercion
   - Removes binding attributes after setup

4. Event Handler Registration
   - Process `on*` event handler attributes
   - Binds event handlers to component methods
   - Provides event context to handler functions
   - Removes event attributes after binding

### Binding Types

| Binding Type     | Description                                                                    | Example                                              |
| ---------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `$bind-text`     | Text content with automatic updates                                            | `<span $bind-text="name"></span>`                    |
| `$bind-html`     | **WARNING: No built-in sanitization.** Renders raw HTML. See Security section. | `<div $bind-html="content"></div>`                   |
| `$bind-value`    | Form input value with two-way binding                                          | `<input $bind-value="username">`                     |
| `$bind-checked`  | Checkbox/radio state                                                           | `<input type="checkbox" $bind-checked="isActive">`   |
| `$bind-disabled` | Element disabled state                                                         | `<button $bind-disabled="isLoading">Submit</button>` |
| `$bind-class`    | Dynamic class operations                                                       | `<div $bind-class="panelClasses">`                   |
| `$bind-attr`     | Dynamically sets or removes multiple element attributes                        | `<button $bind-attr="buttonAttrs">`                  |
| `$bind-*`        | Custom state binding type                                                      | `<div $bind-custom="myState">`                       |

## AI-Assisted Development

ReactiveComponent includes an authoritative prompt specification (`prompt.txt`) that helps developers create robust, accessible web components using AI assistance. It defines the project’s core rules and workflows.

### prompt.txt (Authoritative Prompt)

- Location: project root at `prompt.txt`
- Purpose: Acts as the single source of truth for HTML-first workflow, binding validation, state management rules, and security guidance
- Key directives:
  - HTML-first with approval gate before writing TypeScript/JavaScript
  - Strict binding validation (alphanumeric keys only; no expressions in `$` bindings)
  - Separation of concerns: keep user-facing text in HTML; no HTML/CSS in TS/JS
  - Security guidance for `$bind-html` and custom binding handlers
  - TypeScript-first patterns and use of Lucide Icons for icons
- How to use:
  - Read `prompt.txt` before generating or updating components
  - Draft HTML structure first; request approval before adding TS/JS
  - Use computed properties instead of expressions in bindings
  - Avoid hardcoding secrets or user-facing text in TS/JS

This feature provides:

### Key Benefits

1. Structured Development Process
   - Standardized component creation workflow
   - Built-in validation steps
   - Best practices enforcement

2. Quality Assurance
   - Accessibility compliance checks
   - Performance optimization guidelines
   - Code quality standards

3. Automated Guidance
   - Component architecture recommendations
   - State management patterns
   - Error handling strategies

## Developer Server

Reactive Component uses [Query](https://qery.io) as a developing system that provides bundling, server-side rendering, hot reloading, and state persistence. Here's how they are used together: ReactiveComponent uses [Query](https://qery.io) as a developing system that provides bundling, server-side rendering, hot reloading, and state persistence. Here's how they are used together:

### Getting Started

1. Start by cloning the ReactiveComponent repository:

```sh
git clone https://github.com/gc-victor/reactive-component
```

Then

```sh
cd reactive-component
```

### Installation

1. First, ensure you have all the packages installed:

```bash
# Using pnpm (recommended)
pnpm install
```

Or

```bash
# Using npm
npm install
```

### Setup

Set the local Query settings.

```bash
pnpm query settings
```

Install assets.

```bash
pnpm dev
```

Then in a different terminal run:

```bash
pnpm query asset public
```

### Project Structure

The project includes:

```
dist/index.js             # Distributed version of the Reactive Component
src
├── index.ts              # Reactive Component
├── index.d.ts            # Type definitions for Reactive Component
├── public                # Public Assets
├── pages                 # Application pages
│   ├── get.index.tsx     # Page server function
│   ├── hot-reload        # Hot reload service
│   ├── index.island.js   # Examples of Reactive Components
│   ├── layout            # Layout components
│   ├── lib               # Helper functions
│   └── styles.css        # Global styles
└── tests                 # Test files
```

### Integration Example

Here's how to integrate the BasicCounter component with Query:

```tsx
// src/pages/get.index.tsx
import { Page } from "@/pages/layout/page";

export async function handleRequest(req: Request): Promise<Response> {
  return response(
    <Page>
      <div className="container mx-auto p-4">
        <basic-counter className="p-4 border rounded block">
          <p className="mb-2">
            Count: <span $state="count">0</span>
          </p>
          <button type="button" onclick="decrement" className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
            Decrement
          </button>
          <button type="button" onclick="increment" className="bg-blue-500 text-white px-4 py-2 rounded">
            Increment
          </button>
        </basic-counter>
      </div>
    </Page>,
  );
}
```

### Key Integration Points

1. Initial Render

- Server generates complete HTML document
- Web Components are defined in included scripts
- No hydration needed

2. State Management

- Initial state can be embedded in HTML attributes
- Web Components handle their own state after initialization
- No explicit hydration or state reconciliation is required

3. APIs and Data Flow

- Query functions handle API requests
- Web Components can fetch data through standard APIs
- Database access is controlled through Query's server functions

4. Runtime Behavior

- Server provides initial HTML and required scripts
- Web Components take over client-side functionality
- Clean separation between server and client concerns

### References

- Query Website: https://qery.io
- Query - GitHub: https://github.com/gc-victor/query

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you want to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
