import { computed, effect, signal } from "alien-signals";

// --- Constants for repetitive strings ---
const CONTEXT_ID_PREFIX = "reactive-component-context-";
const REF_ATTRIBUTE = "$ref";
const STATE_ATTRIBUTE = "$state";
const BIND_ATTRIBUTE_PREFIX = "$bind-";
const EVENT_ATTRIBUTE_PREFIX = "on";

// Binding Types
const BINDING_TYPE_VALUE = "value";
const BINDING_TYPE_TEXT = "text";
const BINDING_TYPE_HTML = "html";
const BINDING_TYPE_CHECKED = "checked";
const BINDING_TYPE_DISABLED = "disabled";
const BINDING_TYPE_CLASS = "class";
const BINDING_TYPE_STYLE = "style";
const BINDING_TYPE_STATE = "state";
const BINDING_TYPE_ATTR = "attr";

// Input Types
const INPUT_TYPE_CHECKBOX = "checkbox";
const INPUT_TYPE_RADIO = "radio";
const INPUT_TYPE_NUMBER = "number";
const INPUT_TYPE_RANGE = "range";

// Event Names
const EVENT_INPUT = "input";
const EVENT_CHANGE = "change";

// ClassList Methods
const CLASS_LIST_ADD = "add";
const CLASS_LIST_REMOVE = "remove";
const CLASS_LIST_REPLACE = "replace";
const CLASS_LIST_TOGGLE = "toggle";

// Attribute Names
const ATTRIBUTE_CLASS = "class";
const ATTRIBUTE_NAME = "name";
const ATTRIBUTE_TYPE = "type";

// Console Warnings/Errors
const WARN_CONTEXT_NOT_FOUND = (key: string) => `Cannot expose context "${key}": state or computed value not found`;
const WARN_CONTEXT_CONSUME_NOT_FOUND = (key: string) => `Context "${key}" not found in any parent component`;
const WARN_COMPUTED_REDEFINED = (key: string) => `Computed property "${key}" is being redefined`;
const WARN_CHECKBOX_BIND_VALUE = (element: HTMLElement) =>
    `The checkbox ${element} has ${BIND_ATTRIBUTE_PREFIX}${BINDING_TYPE_VALUE} attribute, use ${BIND_ATTRIBUTE_PREFIX}${BINDING_TYPE_CHECKED} instead.`;
const WARN_RADIO_BIND_CHECKED = (element: HTMLElement) =>
    `The radio ${element} has ${BIND_ATTRIBUTE_PREFIX}${BINDING_TYPE_CHECKED} attribute, use ${BIND_ATTRIBUTE_PREFIX}${BINDING_TYPE_VALUE} instead.`;
const ERROR_INVALID_BINDING_VALUE = (name: string, value: string) =>
    `Invalid binding ${name} value "${value}": must only contain alphanumeric characters`;
const ERROR_INVALID_BINDING_TYPE = (type: string, name: string) =>
    `Invalid binding type "${type}" in attribute "${name}": must only contain alphanumeric characters or hyphens`;
const ERROR_EVENT_HANDLER_MISSING = "Event binding requires event name and handler";
const ERROR_HANDLER_NOT_FUNCTION = (handler: string) => `Handler method "${handler}" not found or not a function`;

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
export function createContext(stateKey: string): Context {
    const id = `${CONTEXT_ID_PREFIX}${stateKey}`;

    return {
        id: Symbol(id),
        eventName: id,
        state: stateKey,
    };
}

/** Context update event details structure */
interface ContextUpdateEvent {
    key: string;
    value: StateValue;
    source: ReactiveComponent;
}

/** Represents possible state values that can be stored and managed by the component */
export type StateValue = string | number | boolean | object | null | undefined;

/** Valid property types that can be bound to DOM elements */
type PropertyType =
    | typeof BINDING_TYPE_VALUE
    | typeof BINDING_TYPE_TEXT
    | typeof BINDING_TYPE_HTML
    | typeof BINDING_TYPE_CHECKED
    | typeof BINDING_TYPE_DISABLED
    | typeof BINDING_TYPE_CLASS
    | typeof BINDING_TYPE_STYLE
    | typeof BINDING_TYPE_STATE
    | typeof BINDING_TYPE_ATTR;

/**
 * A base class for creating reactive web components with automatic DOM binding and state management.
 * Provides declarative state management, computed properties, and automatic DOM updates.
 */
export class ReactiveComponent extends HTMLElement {
    /** Maps state keys to their signal values */
    private state: Map<string, ReturnType<typeof signal>> = new Map();

    /** Tracks exposed context values */
    private exposedContexts: Set<symbol> = new Set();

    /** Tracks consumed context subscriptions with cleanup functions */
    private contextSubscriptions: Map<string, () => void> = new Map();

    /** Maps keys to their computed signals */
    private derived: Map<string, ReturnType<typeof computed>> = new Map();

    /** Maps state keys to their bound DOM elements and binding types */
    private bindings: Map<string, Set<{ element: HTMLElement; type: PropertyType }>> = new Map();

    /** Tracks mutation observers for dynamic content */
    private observers: Map<HTMLElement, MutationObserver> = new Map();

    /** Maps state keys to their declaring elements */
    private stateElements: Map<string, HTMLElement> = new Map();

    /** Reference map for quickly accessing elements */
    protected refs: Record<string, HTMLElement> = {};

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
    constructor() {
        super();
        this.processElement = this.processElement.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
    }

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
    connectedCallback() {
        this.processChildren(this);
        this.setupMutationObserver();
    }

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
    protected exposeContext(context: Context): void {
        const key = context.state;

        if (!this.state.has(key) && !this.derived.has(key)) {
            console.warn(WARN_CONTEXT_NOT_FOUND(key));
            return;
        }

        this.exposedContexts.add(context.id);

        // Set up effect to broadcast changes to children
        this.effect(() => {
            const value = this.getState(key);
            this.broadcastContextUpdate(context, value as StateValue);
        });
    }

    /**
     * Broadcasts a context update to child components
     * @param {Context} context - The context being updated
     * @param {StateValue} value - The new context value
     * @private
     */
    private broadcastContextUpdate(context: Context, value: StateValue): void {
        const key = context.state;
        const event = new CustomEvent<ContextUpdateEvent>(context.eventName, {
            bubbles: true,
            composed: true,
            detail: {
                key,
                value,
                source: this,
            },
        });

        this.dispatchEvent(event);
    }

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
    protected consumeContext(context: Context): void {
        const key = context.state;
        const provider = this.findContextProvider(context);

        if (!provider) {
            console.warn(WARN_CONTEXT_CONSUME_NOT_FOUND(key));
            return;
        }

        // Initialize with current value
        const initialValue = provider.getState(key);
        this.setState(key, initialValue);

        // Set up subscription to future updates
        const cleanup = this.subscribeToContextUpdates(context, provider, (value) => {
            const signal = this.state.get(key);
            if (signal) {
                signal(value);
                this.handleStateChange(key);
            }
        });

        // Store cleanup function
        this.contextSubscriptions.set(key, cleanup);
    }

    /**
     * Finds the nearest parent component that exposes the specified context
     * @param {Context} context - The context to find
     * @returns {ReactiveComponent | null} The provider component or null if not found
     * @private
     */
    private findContextProvider(context: Context): ReactiveComponent | null {
        let current = this.parentElement;

        while (current) {
            if (current instanceof ReactiveComponent && current.exposedContexts && current.exposedContexts.has(context.id)) {
                return current;
            }
            current = current.parentElement;
        }

        return null;
    }

    /**
     * Subscribes to context updates from a provider
     * @param {Context} context - Context to subscribe to
     * @param {ReactiveComponent} provider - Provider component
     * @param {function} callback - Callback to run when context updates
     * @returns {function} Cleanup function to unsubscribe
     * @private
     */
    private subscribeToContextUpdates(context: Context, provider: ReactiveComponent, callback: (value: StateValue) => void): () => void {
        const key = context.state;
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent<ContextUpdateEvent>;
            const detail = customEvent.detail;

            if (detail.key === key && detail.source === provider) {
                callback(detail.value);
            }
        };

        provider.addEventListener(context.eventName, handler);

        return () => {
            provider.removeEventListener(context.eventName, handler);
        };
    }

    /**
     * Lifecycle method called when component is disconnected from the DOM.
     * Cleans up effects and observers.
     */
    disconnectedCallback() {
        for (const observer of this.observers.values()) {
            observer.disconnect();
        }
        this.observers.clear();

        // Cleanup context subscriptions
        for (const cleanup of this.contextSubscriptions.values()) {
            cleanup();
        }
        this.contextSubscriptions.clear();
    }

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
    protected setState(key: string, value: unknown): void {
        const coercedValue = this.coerceValue(value);
        if (!this.state.has(key)) {
            this.state.set(key, signal(coercedValue as unknown));
            this.defineStateProperty(key);
        } else {
            const stateSignal = this.state.get(key);
            if (stateSignal && stateSignal() !== coercedValue) {
                stateSignal(coercedValue);
                this.handleStateChange(key);
            }
        }
    }

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
    protected getState(key: string): StateValue {
        return this.state.get(key)?.() ?? this.derived.get(key)?.() ?? null;
    }

    /**
     * Defines a property on the component instance for a state key
     * @param {string} key - The state key to define as a property
     * @private
     */
    private defineStateProperty(key: string): void {
        Object.defineProperty(this, key, {
            get: () => this.getState(key),
            set: (value) => this.setState(key, value),
            configurable: true,
            enumerable: true,
        });
    }

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
    protected compute<T extends StateValue[]>(key: string, sources: string[], computation: (...args: T) => StateValue): void {
        if (this.derived.has(key)) {
            console.warn(WARN_COMPUTED_REDEFINED(key));
        }

        const computedSignal = computed(() => {
            const values = sources.map((source) => this.getState(source)) as T;
            const result = computation(...values);

            return this.coerceValue(result);
        });

        this.derived.set(key, computedSignal);

        this.effect(() => {
            // Read the signal to create the dependency
            const value = computedSignal();

            // Then update any bindings
            this.updateBindingsForKey(key, value);
        });
    }

    /**
     * Updates all DOM elements bound to the specified state key with a new value.
     * Iterates through all elements bound to the key and updates them according to their binding type.
     *
     * @param {string} key - The state key whose bindings should be updated
     * @param {StateValue} value - The new value to apply to the bound elements
     * @private
     */
    private updateBindingsForKey(key: string, value: StateValue): void {
        const bindings = this.bindings.get(key);
        if (bindings) {
            for (const { element, type } of bindings) {
                this.updateBinding(key, element, type, value);
            }
        }
    }

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
    protected effect(callback: () => void): () => void {
        return effect(callback);
    }

    /**
     * Processes child elements for bindings and state declarations
     * @param {HTMLElement} root - The root element to process children for
     * @private
     */
    private processChildren(root: HTMLElement): void {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
            acceptNode: (node) => {
                if ((node as HTMLElement).tagName.includes("-") && node !== this) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            },
        });

        let node = walker.nextNode() as HTMLElement | null;
        while (node) {
            this.processElement(node);
            node = walker.nextNode() as HTMLElement | null;
        }
    }

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
    private processElement(element: HTMLElement): void {
        for (const attr of Array.from(element.attributes)) {
            const { name, value } = attr;

            // Validate value matches alphanumeric pattern
            const alphanumericPattern = /^[a-zA-Z0-9]+$/;
            if (!alphanumericPattern.test(value) && name.startsWith("$")) {
                console.error(ERROR_INVALID_BINDING_VALUE(name, value));
                continue;
            }

            if (name === REF_ATTRIBUTE) {
                this.refs[value] = element;
                element.removeAttribute(name);
            } else if (name === STATE_ATTRIBUTE) {
                // Handle direct state declaration
                const stateKey = value;
                this.stateElements.set(stateKey, element);
                const hasBindHtml = element.hasAttribute(BIND_ATTRIBUTE_PREFIX + BINDING_TYPE_HTML);
                const initialValue = this.coerceValue(hasBindHtml ? element.innerHTML : element.textContent);
                this.setState(stateKey, initialValue);
                this.addBinding(stateKey, element, BINDING_TYPE_STATE);
                element.removeAttribute(name);
            } else if (name.startsWith(BIND_ATTRIBUTE_PREFIX)) {
                const type = name.replace(BIND_ATTRIBUTE_PREFIX, "") as PropertyType;
                // Validate type format
                const validBindingTypePattern = /^[a-zA-Z0-9-]+$/;
                if (!validBindingTypePattern.test(type)) {
                    console.error(ERROR_INVALID_BINDING_TYPE(type, name));
                    continue;
                }
                const bindKey = value;

                this.addBinding(bindKey, element, type);
                element.removeAttribute(name);
            } else if (name.startsWith(EVENT_ATTRIBUTE_PREFIX)) {
                const eventName = name.slice(EVENT_ATTRIBUTE_PREFIX.length);
                if (!eventName || !value) {
                    console.error(ERROR_EVENT_HANDLER_MISSING);
                    continue;
                }
                const handler = value;
                const boundHandler = (e: Event) => {
                    const handlerFn = (this as Record<string, unknown>)[handler];
                    if (typeof handlerFn !== "function") {
                        console.error(ERROR_HANDLER_NOT_FUNCTION(handler));
                        return;
                    }
                    handlerFn.call(this, e);
                };
                element.addEventListener(eventName, boundHandler);
                element.removeAttribute(name);
            }
        }
    }

    /**
     * Coerces input values to appropriate state value types
     * @param {unknown} value - Value to coerce
     * @returns {StateValue} Coerced state value
     * @private
     */
    private coerceValue(value: unknown): StateValue {
        if (value === undefined || value === null) return;

        if (value === "") {
            return value;
        }

        if (value === "false" || value === "true") {
            return value === "true";
        }

        if (typeof value === "string") {
            // Try parsing as number first
            const numberValue = Number(value);
            if (!Number.isNaN(numberValue)) {
                return numberValue;
            }

            // Try parsing as JSON for objects/arrays
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed) || typeof parsed === "object") {
                    return parsed;
                }
            } catch (e) {
                // If parsing fails, return original string
                return value;
            }
        }

        return value as StateValue;
    }

    /**
     * Adds a binding between a state key and a DOM element, setting up event handlers for form elements
     * @param {string} stateKey - Key for the state to bind to
     * @param {HTMLElement} element - DOM element to bind
     * @param {PropertyType} type - Type of binding to create
     * @private
     */
    private addBinding(stateKey: string, element: HTMLElement, type: PropertyType): void {
        if (!this.bindings.has(stateKey)) {
            this.bindings.set(stateKey, new Set());
        }
        const bindings = this.bindings.get(stateKey);
        if (bindings) {
            bindings.add({ element, type });
        }

        if (
            (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) &&
            (type === BINDING_TYPE_VALUE || type === BINDING_TYPE_CHECKED)
        ) {
            const inputHandler = () => {
                let value: StateValue = element.value;

                // Special handling for different input types
                if (element instanceof HTMLInputElement) {
                    const elementType = element.type;

                    if (elementType === INPUT_TYPE_CHECKBOX) {
                        if (type === BINDING_TYPE_CHECKED) {
                            value = element.checked;
                        } else if (type === BINDING_TYPE_VALUE) {
                            console.warn(WARN_CHECKBOX_BIND_VALUE(element));
                        }
                    } else if (elementType === INPUT_TYPE_RADIO) {
                        if (type === BINDING_TYPE_CHECKED) {
                            console.warn(WARN_RADIO_BIND_CHECKED(element));
                        } else if (type === BINDING_TYPE_VALUE && element.checked) {
                            this.setState(stateKey, element.value);
                            return;
                        }
                        return;
                    } else if (elementType === INPUT_TYPE_NUMBER || elementType === INPUT_TYPE_RANGE) {
                        value = Number(element.valueAsNumber);
                    } else {
                        value = element.value;
                    }
                } else if (element instanceof HTMLSelectElement) {
                    if (element.multiple) {
                        value = Array.from(element.selectedOptions).map((option) => option.value);
                    } else {
                        value = element.value;
                    }
                } else if (element instanceof HTMLTextAreaElement) {
                    value = element.value;
                }

                this.setState(stateKey, value);
            };

            // Handle change event for elements that need it
            if (
                element instanceof HTMLSelectElement ||
                (element instanceof HTMLInputElement && [INPUT_TYPE_CHECKBOX, INPUT_TYPE_RADIO].includes(element.type))
            ) {
                element.addEventListener(EVENT_CHANGE, inputHandler);
            }

            element.addEventListener(EVENT_INPUT, inputHandler);
        }

        // Initial update
        this.updateBinding(stateKey, element, type, this.getState(stateKey) as StateValue);
    }

    /**
     * Formats a state value for display, handling null/undefined and object values
     * @param {StateValue} value - The value to format
     * @returns {string} Formatted string representation of the value
     * @private
     */
    private formatValue(value: StateValue): string {
        if (value === undefined || value === null) {
            return "";
        }

        if (typeof value === "object") {
            return JSON.stringify(value);
        }

        return String(value);
    }

    /**
     * Updates a binding between a DOM element and state based on binding type
     * @param {string} stateKey - State key for the binding
     * @param {HTMLElement} element - Element to update
     * @param {PropertyType | string} type - Type of binding to apply
     * @param {StateValue} value - Current state value
     * @private
     */
    private updateBinding(stateKey: string, element: HTMLElement, type: PropertyType | string, value: StateValue): void {
        const formattedValue = this.formatValue(value);
        const defaultHandlers: Record<PropertyType | string, () => void> = {
            [BINDING_TYPE_STATE]: () => {
                if (this.stateElements.has(stateKey)) {
                    element.textContent = formattedValue;
                }
            },
            [BINDING_TYPE_VALUE]: () => {
                if ("value" in element) {
                    // Special handling for radio inputs
                    if (element instanceof HTMLInputElement && element.type === INPUT_TYPE_RADIO) {
                        if (formattedValue) {
                            const radioGroup = this.querySelectorAll(`input[type="${INPUT_TYPE_RADIO}"][name="${element.name}"]`);
                            for (const radio of Array.from(radioGroup)) {
                                if (radio instanceof HTMLInputElement) {
                                    radio.checked = radio.value === formattedValue;
                                }
                            }
                        }
                        return; // Skip the default value setting
                    }

                    element.value = formattedValue;
                }
            },
            [BINDING_TYPE_TEXT]: () => {
                element.textContent = formattedValue;
            },
            [BINDING_TYPE_HTML]: () => {
                element.innerHTML = formattedValue;
            },
            [BINDING_TYPE_CHECKED]: () => {
                if ("checked" in element) {
                    element.checked = Boolean(value);
                }
            },
            [BINDING_TYPE_DISABLED]: () => {
                if ("disabled" in element) {
                    element.disabled = Boolean(value);
                }
            },
            [BINDING_TYPE_CLASS]: () => {
                if (!value || typeof value !== "object") return;

                for (const [method, val] of Object.entries(value)) {
                    if (method === CLASS_LIST_ADD || method === CLASS_LIST_REMOVE) {
                        Array.isArray(val) ? element.classList[method](...val) : element.classList[method](val);
                    } else if (method === CLASS_LIST_REPLACE && Array.isArray(val) && val.length === 2) {
                        element.classList.replace(val[0], val[1]);
                    } else if (method === CLASS_LIST_TOGGLE) {
                        if (typeof val === "string") {
                            element.classList.toggle(val);
                        } else if (typeof val === "object") {
                            element.classList.toggle(val.key, val.value);
                        }
                    }
                }

                if (element.classList.length === 0) {
                    element.removeAttribute(ATTRIBUTE_CLASS);
                }
            },
            [BINDING_TYPE_ATTR]: () => {
                if (typeof value === "string") {
                    element.removeAttribute(value);
                } else if (typeof value === "object" && value !== null) {
                    for (const [attr, val] of Object.entries(value)) {
                        if (val === null || val === false) {
                            element.removeAttribute(attr);
                        } else {
                            element.setAttribute(attr, val === true ? "" : String(val));
                        }
                    }
                }
            },
        };

        const customHandlers = this.customBindingHandlers({
            stateKey,
            element,
            formattedValue,
            rawValue: value,
        });
        const handlers = { ...defaultHandlers, ...customHandlers };

        handlers[type]?.();
    }

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
    protected customBindingHandlers({
        stateKey,
        element,
        formattedValue,
        rawValue,
    }: {
        stateKey?: string;
        element?: HTMLElement;
        formattedValue?: string;
        rawValue?: StateValue;
    }): Record<string, () => void> {
        // Default implementation returns empty object
        // Child classes can override this to add custom handlers
        return {};
    }

    /**
     * Manages state changes by updating all bound DOM elements
     * @param {string} key - The state key that changed
     * @private
     */
    private handleStateChange(key: string): void {
        const value = this.getState(key);

        // Update bindings
        const bindings = this.bindings.get(key);
        if (bindings) {
            for (const { element, type } of bindings) {
                this.updateBinding(key, element, type, value);
            }
        }
    }

    /**
     * Sets up mutation observer to handle dynamic DOM changes
     * @private
     */
    private setupMutationObserver(): void {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of Array.from(mutation.addedNodes)) {
                    if (node instanceof HTMLElement) {
                        this.processChildren(node);
                    }
                }
            }
        });

        observer.observe(this, { childList: true, subtree: true });
        this.observers.set(this, observer);
    }
}

declare global {
    interface Window {
        ReactiveComponent: typeof ReactiveComponent;
    }
}

if (typeof window !== "undefined") {
    window.ReactiveComponent = ReactiveComponent;
}
