import { ReactiveComponent, type StateValue } from "./index.js";
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
export declare function define(name: string, definition: Definition): CustomElementConstructor;
