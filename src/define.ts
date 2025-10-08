import { ReactiveComponent, type StateValue } from "./rc.js";

/**
 * A ReactiveComponent with public access to protected methods for define API
 */
export type Element = ReactiveComponent & {
    setState(key: string, value: unknown): void;
    getState(key: string): StateValue;
    compute<T extends StateValue[]>(key: string, sources: string[], computation: (...args: T) => StateValue): void;
    effect(callback: () => void): () => void;
    refs: Record<string, HTMLElement | undefined>;
    [key: string]: unknown;
};

/**
 * State proxy type with property-only API
 */
// biome-ignore lint/suspicious/noExplicitAny: $state is a proxy for any property.
export type State = Record<string, any>;

/**
 * Bind proxy type for method binding
 */
export type Bind = {
    [key: string]: ((...args: unknown[]) => unknown) | undefined;
};

/**
 * Lifecycle methods that can be implemented in define components
 */
export interface LifecycleMethods {
    connected?: () => void;
    disconnected?: () => void;
    adopted?: () => void;
    attributeChanged?: (name: string, oldValue: string | null, newValue: string | null) => void;
}

/**
 * Define component return shape for lifecycle
 */
export type DefinitionReturn = Partial<LifecycleMethods>;

/**
 * Context object provided to define component definitions
 */
export interface Context {
    /**
     * Reference to the component instance with public method wrappers
     */
    $element: Element;

    /**
     * Register element references
     * @param name Reference name
     * @param element HTMLElement to register
     */
    $ref: (name: string) => HTMLElement | undefined;

    /**
     * State management with property-only API
     * - Property mode: $state.property or $state.property = value
     */
    $state: State;

    /**
     * Register an effect that runs after state changes.
     * Returns a cleanup function to remove the effect.
     */
    $effect: (callback: () => void) => () => void;

    /**
     * Compute a derived state value from sources.
     * - Usage: $compute(key, sources, computation)
     */
    $compute: <T extends StateValue[]>(key: string, sources: string[], computation: (...args: T) => StateValue) => void;

    /**
     * Bind methods to the component
     */
    $bind: Bind;
}

/**
 * Define component definition function
 */
export type Definition = (this: Element, context: Context) => unknown;

/**
 * ReactiveComponent wrapper for define API
 */
class Define extends ReactiveComponent {
    // Lifecycle callback storage
    private connected?: () => void;
    private disconnected?: () => void;
    private adopted?: () => void;
    private attributeChanged?: (name: string, oldValue: string | null, newValue: string | null) => void;

    // Public wrappers for protected methods
    public setState(key: string, value: unknown): void {
        super.setState(key, value);
    }

    public getState(key: string): StateValue {
        return super.getState(key);
    }

    public compute<T extends StateValue[]>(key: string, sources: string[], computation: (...args: T) => StateValue): void {
        super.compute(key, sources, computation);
    }

    public effect(callback: () => void): () => void {
        return super.effect(callback);
    }

    /**
     * Initialize define component
     */
    constructor() {
        super();

        // Create context object
        const context: Context = {
            $element: this as unknown as Element,

            // Reference registration
            $ref: (name: string) => {
                return (this as unknown as Element).refs[name];
            },

            // State proxy with property-only API
            $state: new Proxy({} as Record<string, StateValue | undefined>, {
                get: (_target, prop: string | symbol): unknown => {
                    if (typeof prop === "string") {
                        const value = this.getState(prop);
                        return value === null ? undefined : value;
                    }
                    return undefined;
                },
                set: (_target, prop: string | symbol, value: unknown): boolean => {
                    if (typeof prop === "string") {
                        this.setState(prop, value);
                    }
                    return true;
                },
                has: (_target, prop: string | symbol): boolean => {
                    if (typeof prop === "string") {
                        const value = this.getState(prop);
                        return value !== undefined && value !== null;
                    }
                    return false;
                },
            }),

            // Unified effect method - always use context version
            $effect: (callback: () => void): (() => void) => {
                return this.effect(callback);
            },

            // Unified compute method - always use context version
            $compute: <T extends StateValue[]>(key: string, sources: string[], computation: (...args: T) => StateValue): void => {
                this.compute(key, sources, computation);
            },

            // Method binding proxy
            $bind: new Proxy({} as Bind, {
                set: (_target, prop: string | symbol, value: unknown): boolean => {
                    if (typeof prop === "string" && typeof value === "function") {
                        // Bind regular methods to the component
                        const boundMethod = value.bind(this);
                        Object.defineProperty(this, prop, {
                            value: boundMethod,
                            writable: true,
                            enumerable: true,
                            configurable: true,
                        });
                    }
                    return true;
                },
                get: (_target, prop: string | symbol): unknown => {
                    if (typeof prop === "string") {
                        return (this as Record<string, unknown>)[prop];
                    }
                    return undefined;
                },
            }),
        };

        // Get the definition function from the constructor
        const ctor = this.constructor as typeof Define & { __definition?: Definition };
        const definition = ctor.__definition;

        if (definition) {
            // Call the definition function with the context
            const result = definition.call(this as unknown as Element, context);
            const ret = (typeof result === "object" && result !== null ? result : {}) as DefinitionReturn;

            const { connected, disconnected, adopted, attributeChanged } = ret;

            if (connected) this.connected = connected;
            if (disconnected) this.disconnected = disconnected;
            if (adopted) this.adopted = adopted;
            if (attributeChanged) this.attributeChanged = attributeChanged;
        }
    }

    // Override lifecycle methods to call define callbacks
    connectedCallback(): void {
        super.connectedCallback();
        this.connected?.();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.disconnected?.();
    }

    adoptedCallback(): void {
        this.adopted?.();
    }

    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
        this.attributeChanged?.(name, oldValue, newValue);
    }

    // Static property to store definition
    static __definition?: Definition;
}

/**
 * Define a web component using the define context
 *
 * @param name The kebab-case name for the custom element
 * @param definition A named function that defines the component
 * @returns The custom element constructor
 *
 * @example
 * ```typescript
 * define("rc-counter", function Counter({ $state, $bind, $effect, $compute, $ref }) {
 *     // Initialize state
 *     $state.count = 0;
 *
 *     // Bind methods for event handlers
 *     $bind.increment = () => {
 *         $state.count = ($state.count as number) + 1;
 *     };
 *
 *     // Create computed values
 *     $compute("doubleCount", ["count"], (count) => (count as number) * 2);
 *
 *     // Add effects
 *     $effect(() => {
 *         console.log("Count changed:", $state.count);
 *     });
 *
 *     // Access element references
 *     $bind.focusInput = () => {
 *         const input = $ref("countInput");
 *         input?.focus();
 *     };
 *
 *     return {
 *         connected: () => {
 *             console.log("Counter connected!");
 *         },
 *     };
 * });
 * ```
 */
export function define(name: string, definition: Definition): CustomElementConstructor {
    const elementName = name;

    // Create a new class for this specific component
    class ComponentClass extends Define {
        static override __definition = definition;
    }

    // Register the custom element
    if (!customElements.get(elementName)) {
        customElements.define(elementName, ComponentClass as unknown as CustomElementConstructor);
    }

    return ComponentClass as unknown as CustomElementConstructor;
}

// Export for global access if needed
if (typeof window !== "undefined") {
    (window as Window & { define?: typeof define }).define = define;
}
