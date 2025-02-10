import { computed, effect, signal } from "alien-signals";

/** Represents possible state values that can be stored and managed by the component */
type StateValue = string | number | boolean | object | null | undefined;

/** Valid property types that can be bound to DOM elements */
type PropertyType = "value" | "text" | "html" | "checked" | "disabled" | "class" | "style" | "state";

/**
 * A base class for creating reactive web components with automatic DOM binding and state management.
 * Provides declarative state management, computed properties, and automatic DOM updates.
 */
export class ReactiveComponent extends HTMLElement {
    /** Maps state keys to their signal values */
    private state: Map<string, ReturnType<typeof signal>> = new Map();

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
     * Lifecycle method called when component is disconnected from the DOM.
     * Cleans up effects and observers.
     */
    disconnectedCallback() {
        for (const observer of this.observers.values()) {
            observer.disconnect();
        }
        this.observers.clear();
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
    protected compute(key: string, sources: string[], computation: (...args: unknown[]) => StateValue): void {
        if (this.derived.has(key)) {
            console.warn(`Computed property "${key}" is being redefined`);
        }

        const computedSignal = computed(() => {
            const values = sources.map((source) => this.getState(source));
            const result = computation(...values);
            return this.coerceValue(result);
        });

        this.derived.set(key, computedSignal);

        this.effect(() => {
            this.handleStateChange(key);
        });
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
                if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_REJECT;
                if (node.tagName.includes("-") && node !== this) return NodeFilter.FILTER_REJECT;
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
                throw new Error(`Invalid binding ${name} value "${value}": must only contain alphanumeric characters`);
            }

            if (name === "$ref") {
                if (!value) {
                    throw new Error("Ref attribute requires a value");
                }
                this.refs[value] = element;
                element.removeAttribute(name);
            } else if (name === "$state") {
                // Handle direct state declaration
                const stateKey = value;
                if (!stateKey) {
                    throw new Error("State binding requires a key");
                }
                this.stateElements.set(stateKey, element);
                const hasBindHtml = element.hasAttribute("$bind-html");
                const initialValue = this.coerceValue(hasBindHtml ? element.innerHTML : element.textContent);
                this.setState(stateKey, initialValue);
                this.addBinding(stateKey, element, "state");
                element.removeAttribute(name);
            } else if (name.startsWith("$bind-")) {
                const type = name.replace("$bind-", "") as PropertyType;
                if (!type || !value) {
                    throw new Error("Binding requires both type and state key");
                }
                const bindKey = value;
                this.addBinding(bindKey, element, type);
                element.removeAttribute(name);
            } else if (name.startsWith("on")) {
                const eventName = name.slice(2);
                if (!eventName || !value) {
                    throw new Error("Event binding requires event name and handler");
                }
                const handler = value;
                const handlerFn = (this as Record<string, unknown>)[handler];
                if (typeof handlerFn !== "function") {
                    throw new Error(`Handler method "${handler}" not found or not a function`);
                }
                const boundHandler = (e: Event) => {
                    handlerFn.call(this, e);
                };
                element.addEventListener(eventName, boundHandler);
                element.removeAttribute(name);
            }
        }
    }

    /**
     * Coerces input values to appropriate state value types
     * @param {T} value - Value to coerce
     * @returns {StateValue} Coerced state value
     * @private
     */
    private coerceValue<T>(value: unknown): StateValue {
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
            (type === "value" || type === "checked")
        ) {
            const inputHandler = () => {
                let value: StateValue = element.value;

                // Special handling for different input types
                if (element instanceof HTMLInputElement) {
                    switch (element.type) {
                        case "checkbox":
                            value = element.checked;
                            break;
                        case "radio":
                            value = element.value;
                            if (element.checked) {
                                // Update all radio buttons in the same group
                                const radioGroup = Array.from(document.querySelectorAll(`input[type="radio"][name="${element.name}"]`));
                                for (const radio of radioGroup) {
                                    if (radio instanceof HTMLInputElement) {
                                        radio.checked = radio === element;
                                    }
                                }
                            }
                            break;
                        case "number":
                        case "range":
                            value = element.valueAsNumber;
                            break;
                        case "date":
                        case "datetime-local":
                        case "time":
                            value = element.valueAsDate;
                            break;
                        case "file":
                            value = element.files;
                            break;
                        default:
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

            element.addEventListener("input", inputHandler);
            // Handle change event for elements that need it
            if (
                element instanceof HTMLSelectElement ||
                (element instanceof HTMLInputElement &&
                    ["checkbox", "radio", "file", "date", "datetime-local", "time", "month", "week"].includes(element.type))
            ) {
                element.addEventListener("change", inputHandler);
            }

            // Handle blur event for validation-related input types
            if (element instanceof HTMLInputElement && ["email", "url", "tel", "number"].includes(element.type)) {
                element.addEventListener("blur", inputHandler);
            }
        }

        // Initial update
        this.updateBinding(stateKey, element, type, this.getState(stateKey));
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
            state: () => {
                if (this.stateElements.has(stateKey)) {
                    element.textContent = formattedValue;
                }
            },
            value: () => {
                if ("value" in element) {
                    element.value = formattedValue;
                }
            },
            text: () => {
                element.textContent = formattedValue;
            },
            html: () => {
                element.innerHTML = formattedValue;
            },
            checked: () => {
                if ("checked" in element) {
                    element.checked = Boolean(value);
                }
            },
            disabled: () => {
                if ("disabled" in element) {
                    element.disabled = Boolean(value);
                }
            },
            class: () => {
                if (!value || typeof value !== "object") return;

                for (const [method, val] of Object.entries(value)) {
                    if (method === "add" || method === "remove") {
                        Array.isArray(val) ? element.classList[method](...val) : element.classList[method](val);
                    } else if (method === "replace" && Array.isArray(val) && val.length === 2) {
                        element.classList.replace(val[0], val[1]);
                    } else if (method === "toggle") {
                        if (typeof val === "string") {
                            element.classList.toggle(val);
                        } else if (typeof val === "object") {
                            element.classList.toggle(val.key, val.value);
                        }
                    }
                }

                if (element.classList.length === 0) {
                    element.removeAttribute("class");
                }
            },
            attr: () => {
                if (typeof value === "string") {
                    element.removeAttribute(value);
                } else if (typeof value === "object" && value !== null) {
                    for (const [attr, val] of Object.entries(value)) {
                        if (val === null || val === false) {
                            element.removeAttribute(attr);
                        } else {
                            element.setAttribute(attr, String(val));
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
     * @param {string} stateKey - The key of the state being updated
     * @param {HTMLElement} element - The DOM element being updated
     * @param {string} formattedValue - The formatted string value
     * @param {StateValue} rawValue - The raw state value before formatting
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
