/**
 * Provides unique context identity, optional default value, and debugging support.
 */
export interface Context {
    /** Unique identifier for the context */
    readonly id: symbol;
    /** Name for the context used in events */
    readonly eventName: string;
    /** State key for component storage */
    readonly state: string;
}
/**
 * Creates a new context object for sharing state between components.
 *
 * @param stateKey - State key for component storage
 * @returns A Context object for use with exposeContext and consumeContext
 *
 * @example
 * // Create a theme context
 * const ThemeContext = createContext('light', 'ThemeContext');
 */
export declare function createContext(stateKey: string): Context;
/** Represents possible state values that can be stored and managed by the component */
export type StateValue = string | number | boolean | object | null | undefined;
/**
 * A base class for creating reactive web components with automatic DOM binding and state management.
 * Provides declarative state management, computed properties, and automatic DOM updates.
 */
export declare class ReactiveComponent extends HTMLElement {
    /** Maps state keys to their signal values */
    private state;
    /** Tracks exposed context values */
    private exposedContexts;
    /** Tracks consumed context subscriptions with cleanup functions */
    private contextSubscriptions;
    /** Maps keys to their computed signals */
    private derived;
    /** Maps state keys to their bound DOM elements and binding types */
    private bindings;
    /** Tracks mutation observers for dynamic content */
    private observers;
    /** Maps state keys to their declaring elements */
    private stateElements;
    /** Reference map for quickly accessing elements */
    protected refs: Record<string, HTMLElement>;
    /**
     * Initializes a new instance of ReactiveComponent.
     * Sets up method bindings and initializes reactive effects.
     * @example
     * ```ts
     * class CounterComponent extends ReactiveComponent {
     *     constructor() {
     *         super();
     *
     *         // Initialize state with a count
     *         this.setState('count', 0);
     *
     *         // Create a computed property for double the count
     *         this.compute('doubleCount', ['count'],
     *             (count) => (count as number) * 2
     *         );
     *
     *         // Setup an effect that logs count changes
     *         this.effect(() => {
     *             console.log(`Count changed to: ${this.getState('count')}`);
     *         });
     *     }
     * }
     * ```
     */
    constructor();
    /**
     * Lifecycle method called when component is connected to the DOM.
     * Initializes child processing and sets up mutation observer.
     * @example
     * ```ts
     * class TodoComponent extends ReactiveComponent {
     *     connectedCallback() {
     *         super.connectedCallback(); // Always call super first
     *
     *         // Initialize state with a count
     *         this.setState('count', 0);
     *
     *         // Create a computed property for double the count
     *         this.compute('doubleCount', ['count'],
     *             (count) => (count as number) * 2
     *         );
     *     }
     * }
     * ```
     */
    connectedCallback(): void;
    /**
     * Exposes a state value as context that child components can consume
     * @param {Context} context - The context to expose
     * @example
     * ```ts
     * const theme = createContext('theme');
     * const colors = createContext('colors');
     *
     * class ThemeProvider extends ReactiveComponent {
     *     constructor() {
     *         super();
     *         this.exposeContext(theme);
     *         this.exposeContext(colors);
     *     }
     *     connectedCallback() {
     *         super.connectedCallback();
     *         this.setState('theme', 'light');
     *         this.setState('colors', { primary: '#3498db', secondary: '#2ecc71' });
     *     }
     *
     *     toggleTheme() {
     *         const currentTheme = this.getState('theme') as string;
     *         this.setState('theme', currentTheme === 'light' ? 'dark' : 'light');
     *     }
     * }
     * ```
     * @protected
     */
    protected exposeContext(context: Context): void;
    /**
     * Broadcasts a context update to child components
     * @param {Context} context - The context being updated
     * @param {StateValue} value - The new context value
     * @private
     */
    private broadcastContextUpdate;
    /**
     * Consumes context from a parent component. Subscribes to updates from the nearest
     * ancestor component that provides this context, and updates local state when the
     * context value changes.
     *
     * @param {Context} context - The context object to consume, previously created with createContext()
     * @returns {void} No return value
     * @example
     * ```ts
     * // Create context in provider component
     * const themeContext = createContext('theme');
     *
     * // Consume context in child component
     * class ThemedButton extends ReactiveComponent {
     *     constructor() {
     *         super;
     *         // Now this.theme will automatically update when parent changes
     *         this.consumeContext(themeContext);
     *     }
     * }
     * ```
     * @protected
     */
    protected consumeContext(context: Context): void;
    /**
     * Finds the nearest parent component that exposes the specified context
     * @param {Context} context - The context to find
     * @returns {ReactiveComponent | null} The provider component or null if not found
     * @private
     */
    private findContextProvider;
    /**
     * Subscribes to context updates from a provider
     * @param {Context} context - Context to subscribe to
     * @param {ReactiveComponent} provider - Provider component
     * @param {function} callback - Callback to run when context updates
     * @returns {function} Cleanup function to unsubscribe
     * @private
     */
    private subscribeToContextUpdates;
    /**
     * Lifecycle method called when component is disconnected from the DOM.
     * Cleans up effects and observers.
     */
    disconnectedCallback(): void;
    /**
     * Sets a new state value and triggers necessary updates
     * @param {string} key - The state key to update
     * @param {unknown} value - The new value to set
     * @example
     * ```ts
     * class CounterComponent extends ReactiveComponent {
     *     constructor() {
     *         super();
     *         // Initialize counter state
     *         this.setState('count', 0);
     *     }
     *
     *     increment() {
     *         const count = this.getState('count') as number;
     *         this.setState('count', count + 1);
     *         // or just: `this.count++;`
     *     }
     *
     *     decrement() {
     *         const count = this.getState('count') as number;
     *         this.setState('count', count - 1);
     *         // or just: `this.count--;`
     *     }
     *
     *     reset() {
     *         this.setState('count', 0);
     *         // or just: `this.count = 0;`
     *     }
     * }
     * ```
     * @protected
     */
    protected setState(key: string, value: unknown): void;
    /**
     * Gets the current value of a state or computed property
     * @param {string} key - The state key to retrieve
     * @returns {StateValue} The current state value
     * @example
     * ```ts
     * class UserProfileComponent extends ReactiveComponent {
     *   displayUserInfo() {
     *     // Access multiple state values
     *     const name = this.getState('username'); // or just: `this.username;`
     *     const age = this.getState('age'); // or just: `this.age;`
     *     const isAdmin = this.getState('isAdmin'); // or just: `this.isAdmin;`
     *
     *     // Use state values to create a formatted string
     *     return `User: ${name}
     *             Age: ${age}
     *             Admin: ${isAdmin ? 'Yes' : 'No'}`;
     *   }
     * }
     * ```
     * @protected
     */
    protected getState(key: string): StateValue;
    /**
     * Defines a property on the component instance for a state key
     * @param {string} key - The state key to define as a property
     * @private
     */
    private defineStateProperty;
    /**
     * Creates a computed property that updates based on source state changes
     * @param {string} key - The computed property key
     * @param {string[]} sources - State keys this computed property depends on
     * @param {Function} computation - Function to compute the derived value
     * @example
     * ```ts
     * class ShoppingCartComponent extends ReactiveComponent {
     *     constructor() {
     *         super();
     *
     *         // Initialize cart state
     *         this.setState('items', [
     *             { name: 'Item 1', price: 10 },
     *             { name: 'Item 2', price: 20 }
     *         ]);
     *         this.setState('taxRate', 0.1); // 10% tax
     *
     *         // Compute subtotal from items
     *         this.compute('subtotal', ['items'],
     *             (items: Array<{price: number}>) =>
     *                 items.reduce((sum, item) => sum + item.price, 0)
     *         );
     *
     *         // Compute total with tax based on subtotal
     *         this.compute('total', ['subtotal', 'taxRate'],
     *             (subtotal: number, taxRate: number) =>
     *                 subtotal * (1 + taxRate)
     *         );
     *     }
     * }
     * ```
     * @protected
     */
    protected compute<T extends StateValue[]>(key: string, sources: string[], computation: (...args: T) => StateValue): void;
    /**
     * Updates all DOM elements bound to the specified state key with a new value.
     * Iterates through all elements bound to the key and updates them according to their binding type.
     *
     * @param {string} key - The state key whose bindings should be updated
     * @param {StateValue} value - The new value to apply to the bound elements
     * @private
     */
    private updateBindingsForKey;
    /**
     * Creates a new reactive effect
     * @param {Function} callback - The effect function to execute
     * @returns {Function} Cleanup function to dispose the effect
     * @example
     * ```ts
     * class ThemeComponent extends ReactiveComponent {
     *     constructor() {
     *         super();
     *         this.setState('darkMode', false);
     *
     *         // Create effect to update body class when theme changes
     *         this.effect(() => {
     *             document.body.classList.toggle('dark-theme', this.isDark);
     *         });
     *     }
     * }
     * ```
     * @protected
     */
    protected effect(callback: () => void): () => void;
    /**
     * Processes child elements for bindings and state declarations
     * @param {HTMLElement} root - The root element to process children for
     * @private
     */
    private processChildren;
    /**
     * Processes an element's attributes for special bindings and state declarations.
     * @param {HTMLElement} element - The DOM element to process
     * @example
     * ```typescript
     * // Reference elements using $ref
     * <div $ref="header">Header Content</div>
     * // Access in component via: this.refs.header
     *
     * // Declare state on elements
     * <p $state="message">Initial message</p>
     * // Access via: this.message or this.getState('message')
     *
     * // Data binding examples:
     * <input $bind-value="name" /> // Two-way binding to this.name
     * <p $bind-text="status"></p> // One-way text binding
     * <div $bind-html="content"></div> // One-way HTML binding
     * <input type="checkbox" $bind-checked="isEnabled" /> // Checked binding
     * <button $bind-disabled="isLoading"></button> // Disabled binding
     * <div $bind-class="isActive"></div> // ClassList binding ({ add: 'active', remove: 'inactive' })
     *
     * // Event handling
     * <button onclick="handleClick">Click Me</button>
     * // Define in component: handleClick() { console.log('clicked'); }
     * ```
     * @private
     */
    private processElement;
    /**
     * Coerces input values to appropriate state value types
     * @param {unknown} value - Value to coerce
     * @returns {StateValue} Coerced state value
     * @private
     */
    private coerceValue;
    /**
     * Adds a binding between a state key and a DOM element, setting up event handlers for form elements
     * @param {string} stateKey - Key for the state to bind to
     * @param {HTMLElement} element - DOM element to bind
     * @param {PropertyType} type - Type of binding to create
     * @private
     */
    private addBinding;
    /**
     * Formats a state value for display, handling null/undefined and object values
     * @param {StateValue} value - The value to format
     * @returns {string} Formatted string representation of the value
     * @private
     */
    private formatValue;
    /**
     * Updates a binding between a DOM element and state based on binding type
     * @param {string} stateKey - State key for the binding
     * @param {HTMLElement} element - Element to update
     * @param {PropertyType | string} type - Type of binding to apply
     * @param {StateValue} value - Current state value
     * @private
     */
    private updateBinding;
    /**
     * Protected method to allow child classes to add custom binding handlers
     * @param {object} params - Parameters for the handler
     * @param {string} params.stateKey - The key of the state being updated
     * @param {HTMLElement} params.element - The DOM element being updated
     * @param {string} params.formattedValue - The formatted string value
     * @param {StateValue} params.rawValue - The raw state value before formatting
     * @returns {Record<string, () => void>} Record of custom binding handlers
     * @example
     * ```ts
     * class CustomComponent extends ReactiveComponent {
     *     protected customBindingHandlers({
     *         stateKey,
     *         element,
     *         formattedValue,
     *         rawValue
     *     }: {
     *         stateKey: string;
     *         element: HTMLElement;
     *         formattedValue: string;
     *         rawValue: StateValue;
     *     }): Record<string, () => void> {
     *         return {
     *             // Custom binding for progress element
     *             'progress': () => {
     *                 if (element instanceof HTMLProgressElement) {
     *                     element.value = Number(rawValue) || 0;
     *                 }
     *             },
     *             // Custom binding for data attributes
     *             'data': () => {
     *                 if (typeof rawValue === 'object' && rawValue !== null) {
     *                     for (const [key, value] of Object.entries(rawValue)) {
     *                         element.dataset[key] = String(value);
     *                     }
     *                 }
     *             }
     *         };
     *     }
     * }
     * ```
     * @protected
     */
    protected customBindingHandlers({ stateKey, element, formattedValue, rawValue, }: {
        stateKey?: string;
        element?: HTMLElement;
        formattedValue?: string;
        rawValue?: StateValue;
    }): Record<string, () => void>;
    /**
     * Manages state changes by updating all bound DOM elements
     * @param {string} key - The state key that changed
     * @private
     */
    private handleStateChange;
    /**
     * Sets up mutation observer to handle dynamic DOM changes
     * @private
     */
    private setupMutationObserver;
}
declare global {
    interface Window {
        ReactiveComponent: typeof ReactiveComponent;
    }
}
