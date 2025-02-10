# Reactive Component

Reactive Component is a lightweight library for building modern web components with native standards. It extends the Custom Elements API by adding a signal-based reactive system for declarative DOM manipulation and precise state management. Using simple directives like `$state` and `$bind-*,` you can easily bind the component state to the DOM, keeping your UI in sync with changes.

This HTML-first approach lets you work directly with your existing markup—there is no need for virtual DOM diffing, heavy templating, or build steps. Computed properties and automatic dependency tracking handle updates, so you can focus on your app’s logic.

In summary, Reactive Component offers reactive state management and declarative data binding in a simple, standards-compliant way—without the complexity of larger frameworks.

## Features

- **Reactive:** Automatically update the DOM when the state changes.
- **Computed:** Instantly refresh derived values.
- **Declarative Binding:** Keep UI and data in sync with minimal code.
- **Zero Build:** Use plain HTML and Custom Elements, no bundlers needed.
- **Progressive Enhancement:** Boost SEO, speed up initial loads, and simplify maintenance.
- **High Performance:** Direct DOM updates in a ~3.5KB gzipped package.
- **TypeScript:** Benefit from type safety and smarter tooling.
- **Framework Agnostic:** Easily integrate with other libraries or legacy systems.

## Credits

[Hawk Ticehurst's](https://github.com/hawkticehurst) work on [Stellar](https://github.com/hawkticehurst/stellar) and his article ['Declarative Signals'](https://hawkticehurst.com/2024/12/declarative-signals/) inspired this library.

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

1. **Automatic State Management**

   - The `count` property is automatically tracked and managed
   - No explicit state initialization is required
   - Changes trigger efficient DOM updates

2. **Method Auto-binding**

   - Component methods are automatically bound to the instance
   - Clean event handler syntax

3. **Two-way Data Binding**
   - The `$state` directive creates bidirectional binding
   - DOM updates when state changes
   - State updates when DOM changes

Here's the complete example:

```javascript
class BasicCounter extends ReactiveComponent {
  // Methods are automatically bound to the component instance
  increment() {
    this.count++; // Direct property access thanks to proxy handlers
  }

  decrement() {
    this.count--;
  }
}
customElements.define("basic-counter", BasicCounter);
```

```html
<basic-counter>
  <!-- $state directive creates a two-way binding -->
  <p>Count: <span $state="count">0</span></p>

  <!-- onclick attribute automatically binds to component methods -->
  <button onclick="decrement" class="bg-blue-500 text-white px-4 py-2 rounded">Decrement</button>
  <button onclick="increment" class="bg-blue-500 text-white px-4 py-2 rounded">Increment</button>
</basic-counter>
```

### Implementation Details:

1. **State Declaration**

   - Type inference automatically handles number type
   - Initial value of 0 is set and reflected in DOM

2. **Method Implementation**

   - `increment()` and `decrement()` directly modify state
   - Proxy handlers convert property access to state updates
   - Changes automatically trigger view updates

3. **Template Structure**
   - `$state="count"` creates two-way binding for the counter
   - `onclick` handlers map directly to component methods
   - Tailwind classes provide styling without extra CSS

## Core Concepts

### State Management

The component uses a sophisticated signal-based reactive system for efficient state management that provides several powerful features:

1. **Declarative State Initialization**

   - States are initialized using `setState()` with automatic type inference
   - Values can be primitives, objects, or complex data structures
   - State changes trigger efficient, granular re-renders

2. **Computed Properties with Auto-Tracking**

   - Derived values update automatically when dependencies change
   - Smart caching prevents unnecessary recalculations
   - Dependencies are tracked without explicit declarations

3. **Two-Way Data Binding**
   - State changes automatically sync with the DOM
   - DOM events update state seamlessly
   - No manual DOM manipulation is needed

Here's a practical example showing these features in action:

```javascript
class InputEcho extends ReactiveComponent {
  constructor() {
    super();
    // Initialize reactive state with empty string
    this.setState("text", "");

    // Create a computed property that transforms text to uppercase
    // Updates automatically when text changes
    this.compute("uppercase", ["text"], (c) => c.toUpperCase());
  }
}
customElements.define("input-echo", InputEcho);
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

1. **Automatic Dependency Tracking**

   - The system intelligently tracks dependencies between state values
   - Only recomputes when dependent values change
   - Eliminates unnecessary calculations and improves performance

2. **Smart Caching**

   - Computed values are cached until dependencies change
   - Prevents recalculating the same value multiple times
   - Optimizes memory usage and computation time

3. **Declarative Data Flow**
   - Define transformations as pure functions
   - Dependencies are automatically managed
   - Results update seamlessly when source data changes

Here's a practical example of computed properties in action with a temperature converter:

```javascript
class TemperatureConverter extends ReactiveComponent {
  constructor() {
    super();
    // Initialize base temperature in Celsius
    this.setState("celsius", 20);

    // Compute Fahrenheit from Celsius
    // Updates automatically when celsius changes
    this.compute("fahrenheit", ["celsius"], (c) => {
      // Standard C to F conversion formula
      return (c * 9) / 5 + 32;
    });
  }
}
customElements.define("temperature-converter", TemperatureConverter);
```

```html
<temperature-converter>
  <div class="space-y-2">
    <!-- Base temperature with two-way binding -->
    <p>Celsius: <span $state="celsius">20</span>°C</p>

    <!-- Computed temperatures update automatically -->
    <p>Fahrenheit: <span $bind-text="fahrenheit" />°F</p>

    <!-- Interactive slider updates celsius state -->
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

1. **Type-Safe Element Access**

   - Direct access to DOM elements through the `refs` object
   - Automatic type inference for element properties
   - Compile-time checking for element existence

2. **Ref Registration**

   - Elements marked with `$ref` attribute are automatically registered
   - References are available immediately after component mounting
   - Clean separation between template and logic

3. **Reactive Integration**
   - Refs work seamlessly with reactive state
   - Changes through refs trigger appropriate updates
   - Maintains the component's reactive nature

Here's a practical example demonstrating element references:

```javascript
class RefDemo extends ReactiveComponent {
  constructor() {
    super();
    // Initialize state with default values
    this.setState("outputText", "Initial Text");
    this.setState("outputColor", "black");
  }

  updateText() {
    this.refs.output.textContent =
      this.refs.output.textContent === "Initial Text"
        ? `Updated Text Content (${this.clickCount} clicks)`
        : "Initial Text";
  }

  updateColor() {
    // Toggle text color between black and orange
    this.outputColor = this.outputColor === "black" ? "orange" : "black";
    this.refs.output.style.color = this.outputColor;
  }
}
customElements.define("ref-demo", RefDemo);
```

```html
<ref-demo>
  <div class="space-y-4">
    <p>Click buttons to update referenced element:</p>
    <!-- Element referenced using $ref attribute -->
    <p $ref="output" class="text-xl font-bold text-center p-4 border rounded">Initial Text</p>
    <div class="flex justify-center space-x-4">
      <!-- Event handlers trigger ref-based updates -->
      <button onClick="updateText" class="bg-purple-500 text-white px-4 py-2 rounded">Update Text</button>
      <button onClick="updateColor" class="bg-pink-500 text-white px-4 py-2 rounded">Change Color</button>
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

1. **Automated JSON Serialization**

   - Automatic conversion between JS objects and JSON
   - Pretty-printing with proper indentation
   - Type-safe serialization of complex nested structures

2. **Deep Reactivity**

   - Changes to nested properties trigger updates
   - Computed properties track deep dependencies
   - Metadata automatically updates on state changes

3. **Form Integration**
   - Two-way binding with form inputs
   - Real-time validation and feedback
   - Automatic type coercion for form fields

Here's a practical example demonstrating JSON state management:

```javascript
class JsonStateManager extends ReactiveComponent {
  constructor() {
    super();
    // Initialize form field states
    this.setState("name", "Paco Doe");
    this.setState("age", 30);
    this.setState("bio", "");

    // Create computed JSON representation with metadata
    // Updates automatically when any dependency changes
    this.compute("json", ["name", "age", "bio"], (name, age, bio, lastUpdated) =>
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
  }
}
customElements.define("json-state-management", JsonStateManager);
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

### Form Handling

Form handling in ReactiveComponent provides sophisticated validation, state management, and real-time feedback capabilities. Here's a detailed breakdown of its features:

1. **Reactive Form State Management**

   - Automatic two-way data binding for form inputs
   - Real-time validation and error handling
   - Dynamic enable/disable functionality
   - Status tracking and feedback

2. **Smart Validation System**

   - Built-in validation rules and custom validators
   - Real-time validation feedback
   - Computed validation states
   - Error message management

3. **Accessibility Integration**
   - Keyboard navigation support
   - Screen reader-friendly status messages
   - Focus management

Here's a practical example demonstrating form-handling capabilities:

```javascript
class FormDemo extends ReactiveComponent {
  constructor() {
    super();
    // Initialize form state
    this.setState("isEnabled", document.getElementById("enabled")?.checked ?? false);
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
    this.compute("isSatusValid", ["isEnabled", "inputText"], (enabled, text) => {
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

### Custom Binding Handlers

Custom binding handlers allow you to extend the component's binding capabilities with your own custom logic. This powerful feature enables specialized DOM updates based on state changes.

1. **Handler Definition**

   - Register custom handlers by overriding `customBindingHandlers`
   - Return mapping of binding types to handler functions
   - Access element and value details for fine-grained control

2. **Handler Execution**

   - Automatically called when bound state changes
   - Receives formatted and raw state values
   - Full access to elements for direct DOM manipulation

3. **Integration with State System**
   - Works seamlessly with reactive state management
   - Handlers are reactive and update automatically
   - Clean integration with the existing binding system

Here's a practical example of custom binding handlers:

```typescript
class CustomBindingDemo extends ReactiveComponent {
  constructor() {
    super();
    // Initialize state for various custom bindings
    this.setState("counter", 0);
    this.setState("theme", "light");
    this.setState("status", "idle");
  }

  protected customBindingHandlers(
    stateKey: string,
    element: HTMLElement,
    formattedValue: string,
    rawValue: StateValue,
  ): Record<string, () => void> {
    return {
      // Custom handler for counter animation
      "animate-count": () => {
        element.style.transform = `scale(${1 + Number(rawValue) * 0.1})`;
        element.textContent = formattedValue;
      },

      // Custom handler for theme switching
      "theme-switch": () => {
        const theme = String(rawValue);
        element.classList.remove("theme-light", "theme-dark");
        element.classList.add(`theme-${theme}`);
        element.setAttribute("aria-theme", theme);
      },

      // Custom handler for status indicators
      "status-indicator": () => {
        const status = String(rawValue);
        element.setAttribute("data-status", status);
        element.setAttribute("aria-busy", status === "loading" ? "true" : "false");
        element.classList.toggle("pulse", status === "active");
      },
    };
  }

  // Methods to update state
  increment() {
    this.counter++;
  }

  toggleTheme() {
    this.theme = this.theme === "light" ? "dark" : "light";
  }

  updateStatus(status: string) {
    this.status = status;
  }
}
customElements.define("custom-binding-demo", CustomBindingDemo);
```

```html
<custom-binding-demo>
  <div class="space-y-4">
    <!-- Animated counter binding -->
    <div>
      <span $bind="animate-count:counter" class="text-2xl font-bold transition-transform"> 0 </span>
      <button onclick="increment" class="ml-2 px-4 py-2 bg-blue-500 text-white rounded">Increment</button>
    </div>

    <!-- Theme switching binding -->
    <div $bind="theme-switch:theme" class="p-4 border rounded transition-colors">
      <h3>Theme Demo</h3>
      <button onclick="toggleTheme" class="px-4 py-2 bg-gray-200 rounded">Toggle Theme</button>
    </div>

    <!-- Status indicator binding -->
    <div $bind="status-indicator:status" class="p-2 border rounded">
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

## API Reference

### Component Lifecycle

- `connectedCallback()`: Called when the component is added to the DOM
- `disconnectedCallback()`: Called when the component is removed from the DOM
- `attributeChangedCallback(name, oldValue, newValue)`: Called when an observed attribute changes

### State Methods

- `setState(key: string, value: unknown)`: Initialize or update state with automatic type coercion
- `getState(key: string)`: Retrieve current state value with type safety
- `compute(key: string, dependencies: string[], computation: Function)`: Create computed property with dependency tracking
- `effect(callback: Function)`: Create a side effect that runs when dependencies change
- `customBindingHandlers(stateKey: string, element: HTMLElement, formattedValue: string, rawValue: StateValue)`: Override to add custom binding handlers for state updates

### Element Processing

Processes an element's attributes for special bindings and state declarations. This method is responsible for:

1. **Reference Processing**

   - Handles `$ref` attributes to create element references
   - Populates the component's `refs` object
   - Automatically removes ref attributes after processing

2. **State Declaration Processing**

   - Process `$state` attributes for direct state declarations
   - Extracts initial values from element content
   - Establishes state-to-element bindings
   - Removes state declaration attributes

3. **Binding Setup**

   - Handles `$bind-*` attributes for two-way data binding
   - Establishes appropriate event listeners for form elements
   - Sets up validation and type coercion
   - Removes binding attributes after setup

4. **Event Handler Registration**
   - Process `on*` event handler attributes
   - Binds event handlers to component methods
   - Provides event context to handler functions
   - Removes event attributes after binding

### Binding Types

| Binding Type     | Description                           | Example                                              |
| ---------------- | ------------------------------------- | ---------------------------------------------------- |
| `$bind-text`     | Text content with automatic updates   | `<span $bind-text="name"></span>`                    |
| `$bind-html`     | HTML content with sanitization        | `<div $bind-html="content"></div>`                   |
| `$bind-value`    | Form input value with two-way binding | `<input $bind-value="username">`                     |
| `$bind-checked`  | Checkbox/radio state                  | `<input type="checkbox" $bind-checked="isActive">`   |
| `$bind-disabled` | Element disabled state                | `<button $bind-disabled="isLoading">Submit</button>` |
| `$bind-class`    | Dynamic class binding                 | `<div $bind-class="isActive">`                       |
| `$bind-*`        | Custom state binding type             | `<div $bind-custom="myState">`                       |

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
index.ts                  # Reactive Component
src
├── public                # Public Assets
└── pages                 # Application pages
    ├── get.index.tsx     # Page server function
    ├── hot-reload        # Hot reload service
    ├── index.island.js   # Examples of Reactive Components
    ├── layout            # Layout components
    ├── lib               # Helper functions
    └── styles.css        # Gloval styles
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
          <button type="button" onClick="decrement" className="mr-2 bg-blue-500 text-white px-4 py-2 rounded">
            Decrement
          </button>
          <button type="button" onClick="increment" className="bg-blue-500 text-white px-4 py-2 rounded">
            Increment
          </button>
        </basic-counter>
      </div>
    </Page>,
  );
}
```

### Key Integration Points

1. **Initial Render**

- Server generates complete HTML document
- Web Components are defined in included scripts
- No hydration needed

2. **State Management**

- Initial state can be embedded in HTML attributes
- Web Components handle their own state after initialization
- No explicit hydration or state reconciliation is required

3. **APIs and Data Flow**

- Query functions handle API requests
- Web Components can fetch data through standard APIs
- Database access is controlled through Query's server functions

4. **Runtime Behavior**

- Server provides initial HTML and required scripts
- Web Components take over client-side functionality
- Clean separation between server and client concerns

### References

- [Query Website](https://qery.io)
- [Query - GitHub](https://github.com/gc-victor/query)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you want to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
