import { afterEach, describe, expect, it, vi } from "vitest";
import { type Context, type Definition, define, type Element } from "../../src/define.js";
import { createFixture, simulateCheck, simulateEvent, simulateInput } from "../utils/test-helpers.js";

describe("Define", () => {
    let cleanup: (() => void) | null = null;

    afterEach(() => {
        cleanup?.();
        cleanup = null;
    });

    describe("Component Registration", () => {
        it("should register custom elements and handle re-registration", () => {
            const spy = vi.spyOn(customElements, "define");

            // Test basic registration
            const ComponentClass = define("test-registration", function TestRegistration({ $state }: Context) {
                $state.test = "value";
            });

            expect(customElements.get("test-registration")).toBeDefined();
            expect(ComponentClass).toBeDefined();

            // Test duplicate registration (should not re-register)
            define("test-registration", function TestRegistration({ $state }: Context) {
                $state.test = "value2";
            });

            // Should only be called once for the same name
            expect(spy).toHaveBeenCalledTimes(1);

            spy.mockRestore();
        });
    });

    describe("Core Functionality Integration", () => {
        it("should handle comprehensive state management, binding, and reactivity", () => {
            let effectRunCount = 0;
            let lastEffectValue: unknown;
            let methodCallCount = 0;
            let connectedCalled = false;

            define("comprehensive-test", function ComprehensiveTest({ $state, $bind, $effect, $compute }: Context) {
                // Initialize various state types
                $state.count = 0;
                $state.name = "John";
                $state.active = true;
                $state.items = [1, 2, 3];

                // Complex object state
                $state.user = {
                    firstName: "John",
                    lastName: "Doe",
                    age: 30,
                };

                // Computed properties
                $compute("doubleCount", ["count"], (count: unknown) => (count as number) * 2);
                $compute("fullName", ["user"], (user: unknown) => {
                    const u = user as { firstName: string; lastName: string };
                    return `${u.firstName} ${u.lastName}`;
                });

                // Effects
                $effect(() => {
                    effectRunCount++;
                    lastEffectValue = $state.count;
                });

                // Method binding
                $bind.increment = function (this: Element) {
                    this.setState("count", (this.getState("count") as number) + 1);
                };

                $bind.updateName = () => {
                    methodCallCount++;
                    $state.name = "Updated";
                };

                $bind.updateUser = () => {
                    $state.user = { ...($state.user as object), age: 31 } as unknown;
                };

                return {
                    connected: () => {
                        connectedCalled = true;
                    },
                };
            });

            const { root, cleanup: cleanupFn } = createFixture(`
                <comprehensive-test>
                    <span class="count" $bind-text="count"></span>
                    <span class="double" $bind-text="doubleCount"></span>
                    <span class="name" $bind-text="name"></span>
                    <span class="full" $bind-text="fullName"></span>
                    <button class="inc" onclick="increment">Inc</button>
                    <button class="update" onclick="updateName">Update</button>
                </comprehensive-test>
            `);
            cleanup = cleanupFn;

            const component = root.querySelector("comprehensive-test") as Element;
            const countSpan = component.querySelector(".count");
            const doubleSpan = component.querySelector(".double");
            const nameSpan = component.querySelector(".name");
            const fullSpan = component.querySelector(".full");
            const incBtn = component.querySelector(".inc") as HTMLElement;
            const updateBtn = component.querySelector(".update") as HTMLElement;

            // Test lifecycle
            expect(connectedCalled).toBe(true);

            // Test initial state and computed values
            expect(component.getState("count")).toBe(0);
            expect(component.getState("doubleCount")).toBe(0);
            expect(component.getState("fullName")).toBe("John Doe");
            expect(countSpan?.textContent).toBe("0");
            expect(doubleSpan?.textContent).toBe("0");
            expect(nameSpan?.textContent).toBe("John");
            expect(fullSpan?.textContent).toBe("John Doe");

            // Test initial effect run
            expect(effectRunCount).toBe(1);
            expect(lastEffectValue).toBe(0);

            // Test method binding and reactivity
            simulateEvent(incBtn, "click");
            expect(component.getState("count")).toBe(1);
            expect(component.getState("doubleCount")).toBe(2);
            expect(countSpan?.textContent).toBe("1");
            expect(doubleSpan?.textContent).toBe("2");
            expect(effectRunCount).toBe(2);
            expect(lastEffectValue).toBe(1);

            // Test another method
            simulateEvent(updateBtn, "click");
            expect(methodCallCount).toBe(1);
            expect(component.getState("name")).toBe("Updated");
            expect(nameSpan?.textContent).toBe("Updated");

            // Test complex state updates
            expect(component.getState("active")).toBe(true);
            expect((component.getState("items") as number[]).length).toBe(3);
        });

        it("should handle forms with two-way binding and validation", () => {
            let submitData: { username: string; email: string; agreed: boolean } | null = null;

            define("form-test", function FormTest({ $state, $bind, $compute }: Context) {
                $state.username = "";
                $state.email = "";
                $state.agreed = false;

                // Computed validation
                $compute("isValid", ["username", "email", "agreed"], (username, email, agreed) => {
                    return (username as string).length > 0 && (email as string).includes("@") && (agreed as boolean);
                });

                $bind.handleSubmit = (e: unknown) => {
                    (e as Event).preventDefault();
                    if ($state.isValid) {
                        submitData = {
                            username: $state.username as string,
                            email: $state.email as string,
                            agreed: $state.agreed as boolean,
                        };
                    }
                };
            });

            const { root, cleanup: cleanupFn } = createFixture(`
                <form-test>
                    <form onsubmit="handleSubmit">
                        <input type="text" class="username" $bind-value="username" />
                        <input type="email" class="email" $bind-value="email" />
                        <input type="checkbox" class="agreed" $bind-checked="agreed" />
                        <span class="valid" $bind-text="isValid"></span>
                        <button type="submit">Submit</button>
                    </form>
                </form-test>
            `);
            cleanup = cleanupFn;

            const component = root.querySelector("form-test") as Element;
            const usernameInput = component.querySelector(".username") as HTMLInputElement;
            const emailInput = component.querySelector(".email") as HTMLInputElement;
            const checkbox = component.querySelector(".agreed") as HTMLInputElement;
            const validSpan = component.querySelector(".valid");
            const form = component.querySelector("form") as HTMLFormElement;

            // Initially invalid
            expect(component.getState("isValid")).toBe(false);
            expect(validSpan?.textContent).toBe("false");

            // Fill form
            simulateInput(usernameInput, "john");
            simulateInput(emailInput, "john@example.com");
            simulateCheck(checkbox, true);

            // Should be valid now
            expect(component.getState("isValid")).toBe(true);
            expect(validSpan?.textContent).toBe("true");

            // Submit form
            // Create and dispatch a proper submit event
            const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
            form.dispatchEvent(submitEvent);
            expect(submitData).toEqual({
                username: "john",
                email: "john@example.com",
                agreed: true,
            });
        });

        it("should handle $state and $bind proxy edge branches", () => {
            // Captured variables to assert after component instantiation
            let nullCoerced: unknown;
            let symbolGet: unknown;
            let symbolHas: boolean | null = null;
            let bindExistingIsFunction: boolean | null = null;
            let bindExistingCallResult: unknown;
            let bindNonExistingIsUndefined: boolean | null = null;
            let bindSymbolGet: unknown;

            define("proxy-probe", function ProxyProbe({ $state, $bind }: Context) {
                $state.nullish = null;
                // Directly read via the proxy get-trap after setting null; should yield undefined
                nullCoerced = ($state as Record<string, unknown>).nullish;

                // and $state.has with non-string key path returning false (define.ts L150)
                const sym = Symbol("s");
                symbolGet = Reflect.get($state as object, sym);
                symbolHas = Reflect.has($state as object, sym);

                $bind.sample = () => "ok";
                const existing = Reflect.get($bind as object, "sample") as unknown;
                bindExistingIsFunction = typeof existing === "function";
                bindExistingCallResult = typeof existing === "function" ? (existing as () => unknown)() : undefined;

                const missing = Reflect.get($bind as object, "nope") as unknown;
                bindNonExistingIsUndefined = missing === undefined;

                const symB = Symbol("b");
                bindSymbolGet = Reflect.get($bind as object, symB) as unknown;
            });

            const { root, cleanup: cleanupFn } = createFixture("<proxy-probe></proxy-probe>");
            cleanup = cleanupFn;

            // Ensure element is instantiated (constructor + define context executed)
            const el = root.querySelector("proxy-probe");
            expect(el).toBeTruthy();

            // Assertions for edge branches
            expect(nullCoerced).toBeUndefined(); // null coerces to undefined via $state.get
            expect(symbolGet).toBeUndefined(); // non-string key get -> undefined
            expect(symbolHas).toBe(false); // non-string key has -> false

            expect(bindExistingIsFunction).toBe(true); // $bind.get for existing returns bound function
            expect(bindExistingCallResult).toBe("ok"); // function is callable and returns expected result
            expect(bindNonExistingIsUndefined).toBe(true); // $bind.get for non-existing returns undefined
            expect(bindSymbolGet).toBeUndefined(); // non-string key get -> undefined for $bind.get
        });
    });

    describe("Advanced Features", () => {
        it("should handle lifecycle callbacks and attribute changes", () => {
            let connectedCalled = false;
            let disconnectedCalled = false;
            let adoptedCalled = false;
            let attributeChangedArgs: [string, string | null, string | null] | null = null;

            const def = function LifecycleTest({ $state }: Context) {
                $state.initialized = false;

                return {
                    connected: () => {
                        connectedCalled = true;
                        $state.initialized = true;
                    },
                    disconnected: () => {
                        disconnectedCalled = true;
                    },
                    adopted: () => {
                        adoptedCalled = true;
                    },
                    attributeChanged: (name: string, oldValue: string | null, newValue: string | null) => {
                        attributeChangedArgs = [name, oldValue, newValue];
                    },
                };
            } as Definition;

            define("lifecycle-test", def);

            const { root, cleanup: cleanupFn } = createFixture(`
                <lifecycle-test>
                    <span $bind-text="initialized"></span>
                </lifecycle-test>
            `);
            cleanup = cleanupFn;

            const component = root.querySelector("lifecycle-test") as Element;
            const span = component.querySelector("span");

            // Test connected callback
            expect(connectedCalled).toBe(true);
            expect(component.getState("initialized")).toBe(true);
            expect(span?.textContent).toBe("true");

            // Test attribute change
            const htmlComponent = component as HTMLElement & {
                attributeChangedCallback?: (name: string, oldValue: string | null, newValue: string | null) => void;
                adoptedCallback?: () => void;
            };

            component.setAttribute("test-attr", "new-value");
            htmlComponent.attributeChangedCallback?.("test-attr", null, "new-value");
            expect(attributeChangedArgs).toEqual(["test-attr", null, "new-value"]);

            // Test adopted callback
            htmlComponent.adoptedCallback?.();
            expect(adoptedCalled).toBe(true);

            // Test disconnected callback
            component.remove();
            expect(disconnectedCalled).toBe(true);
        });

        it("should handle element access, custom properties, and edge cases", () => {
            let elementRef: Element | null = null;
            let effectCleanupCalled = false;
            let undefinedValue: unknown;
            let hasExistingProp = false;
            let hasNonExistingProp = false;

            define("advanced-test", function AdvancedTest({ $element, $state, $bind, $effect }: Context) {
                // Element access
                elementRef = $element;

                // Custom properties
                $element.customProp = "custom value";
                $element.customMethod = () => "result";

                // Edge cases
                undefinedValue = $state.nonExistent;
                $state.nullValue = null;
                $state.existingValue = "exists";

                hasExistingProp = "existingValue" in $state;
                hasNonExistingProp = "nonExistingValue" in $state;

                // Effect with cleanup
                const cleanup = $effect(() => {
                    // Effect runs
                });

                // Test cleanup
                setTimeout(() => {
                    cleanup();
                    effectCleanupCalled = true;
                }, 0);

                // Method overriding test
                $bind.method = () => "first";
                $bind.method = () => "second"; // Should override

                // Direct state manipulation
                $state.count = 5;
                $element.setState("direct", "value");
            });

            const { root, cleanup: cleanupFn } = createFixture(`
                <advanced-test>
                    <button onclick="method">Test</button>
                </advanced-test>
            `);

            const component = root.querySelector("advanced-test") as Element;

            // Test element access
            expect(elementRef).toBe(component);

            // Test custom properties
            expect(component.customProp).toBe("custom value");
            expect((component.customMethod as () => string)()).toBe("result");

            // Test state edge cases
            expect(undefinedValue).toBe(undefined);
            expect(hasExistingProp).toBe(true);
            expect(hasNonExistingProp).toBe(false);

            // Test state values
            expect(component.getState("count")).toBe(5);
            expect(component.getState("direct")).toBe("value");
            expect(component.getState("nullValue")).toBe(null);

            // Test method overriding
            const button = component.querySelector("button");
            if (button) {
                simulateEvent(button, "click");
                // Should call the overridden method (second one)
                expect((component as { method?: () => string }).method?.()).toBe("second");
            }

            cleanup = cleanupFn;

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(effectCleanupCalled).toBe(true);
                    resolve();
                }, 10);
            });
        });

        it("should handle empty components and minimal definitions", () => {
            define("empty-test", function EmptyTest(_: Context) {
                // Minimal component
            });

            const { root, cleanup: cleanupFn } = createFixture("<empty-test></empty-test>");
            cleanup = cleanupFn;

            const component = root.querySelector("empty-test");
            expect(component).toBeDefined();
            expect(component?.tagName.toLowerCase()).toBe("empty-test");
        });
    });

    describe("Reference Integration", () => {
        it("should handle element references through $ref function", () => {
            let headerRef: HTMLElement | null = null;
            let contentRef: HTMLElement | null = null;

            define("ref-integration", function RefIntegration({ $ref }: Context) {
                // Access refs after DOM is processed
                setTimeout(() => {
                    headerRef = $ref("header") || null;
                    contentRef = $ref("content") || null;
                }, 0);
            });

            const { cleanup: cleanupFn } = createFixture(`
                <ref-integration>
                    <div $ref="header">Header Content</div>
                    <div $ref="content">Main Content</div>
                </ref-integration>
            `);
            cleanup = cleanupFn;

            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    expect(headerRef).toBeDefined();
                    expect(headerRef?.textContent).toBe("Header Content");
                    expect(contentRef).toBeDefined();
                    expect(contentRef?.textContent).toBe("Main Content");
                    resolve();
                }, 10);
            });
        });
    });
});
