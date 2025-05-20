import { ReactiveComponent } from "@/index";
import { TestReactiveComponent, createComponent } from "@tests/utils/test-helpers";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("ReactiveComponent Lifecycle (Core)", () => {
    describe("Component Instantiation", () => {
        it("should properly instantiate a component", () => {
            class TestComponent extends TestReactiveComponent {}
            customElements.define("test-basic-component", TestComponent);

            const { component, cleanup } = createComponent<TestComponent>("test-basic-component");

            expect(component).toBeInstanceOf(ReactiveComponent);
            expect(component).toBeInstanceOf(HTMLElement);

            cleanup();
        });
    });

    describe("Basic Lifecycle Methods", () => {
        let lifecycleCalls: string[] = [];

        class LifecycleTestComponent extends TestReactiveComponent {
            message!: string;

            constructor() {
                super();
                this.testSetState("message", "Initial message");
                lifecycleCalls.push("constructor");
            }

            connectedCallback() {
                super.connectedCallback();
                lifecycleCalls.push("connectedCallback");
            }

            disconnectedCallback() {
                super.disconnectedCallback();
                lifecycleCalls.push("disconnectedCallback");
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                lifecycleCalls.push(`attributeChangedCallback:${name}:${oldValue}:${newValue}`);
            }

            static get observedAttributes() {
                return ["data-test"];
            }
        }
        customElements.define("test-lifecycle-basic", LifecycleTestComponent);

        beforeEach(() => {
            lifecycleCalls = [];
        });

        it("should call lifecycle methods in the correct order", () => {
            const { component, cleanup } = createComponent<LifecycleTestComponent>("test-lifecycle-basic");

            expect(lifecycleCalls).toContain("constructor");
            expect(lifecycleCalls).toContain("connectedCallback");
            expect(lifecycleCalls.indexOf("constructor")).toBeLessThan(lifecycleCalls.indexOf("connectedCallback"));

            cleanup();

            expect(lifecycleCalls).toContain("disconnectedCallback");
        });

        it("should handle attribute changes", () => {
            const { component, cleanup } = createComponent<LifecycleTestComponent>("test-lifecycle-basic");

            lifecycleCalls = [];

            component.setAttribute("data-test", "test-value");
            expect(lifecycleCalls).toContain("attributeChangedCallback:data-test:null:test-value");

            component.setAttribute("data-test", "updated-value");
            expect(lifecycleCalls).toContain("attributeChangedCallback:data-test:test-value:updated-value");

            cleanup();
        });
    });

    describe("Component Lifecycle", () => {
        let lifeCycleLog: string[] = [];

        class LifecycleComponent extends TestReactiveComponent {
            connectedCallback() {
                super.connectedCallback();
                lifeCycleLog.push("connected");
            }

            disconnectedCallback() {
                super.disconnectedCallback();
                lifeCycleLog.push("disconnected");
            }
        }
        customElements.define("test-lifecycle-component", LifecycleComponent);

        beforeEach(() => {
            lifeCycleLog = [];
        });

        it("should call lifecycle methods correctly", async () => {
            const { component, cleanup } = createComponent<LifecycleComponent>("test-lifecycle-component");

            expect(lifeCycleLog).toContain("connected");

            cleanup();

            expect(lifeCycleLog).toContain("disconnected");
        });
    });

    describe("Component State Initialization", () => {
        class StateInitComponent extends TestReactiveComponent {
            count!: number;
            message!: string;
            initialized = false;

            constructor() {
                super();
                this.testSetState("count", 0);
                this.testSetState("message", "Initial");
            }

            connectedCallback() {
                super.connectedCallback();
                this.initialized = true;
                this.count = 1;
            }
        }
        customElements.define("test-state-init", StateInitComponent);

        it("should initialize state before connectedCallback", () => {
            const { component, cleanup } = createComponent<StateInitComponent>("test-state-init");

            expect(component.initialized).toBe(true);
            expect(component.count).toBe(1);
            expect(component.message).toBe("Initial");

            cleanup();
        });
    });

    describe("DOM Operations During Lifecycle", () => {
        class DomOpsComponent extends TestReactiveComponent {
            domOperations: string[] = [];

            connectedCallback() {
                super.connectedCallback();

                this.appendChild(document.createElement("span"));
                this.domOperations.push("appendChild");
                this.domOperations.push("connectedCallback");
            }

            disconnectedCallback() {
                super.disconnectedCallback();
                this.domOperations.push("disconnectedCallback");
            }
        }
        customElements.define("test-dom-ops", DomOpsComponent);

        it("should allow DOM operations during lifecycle", () => {
            const { component, cleanup } = createComponent<DomOpsComponent>("test-dom-ops", {}, undefined);

            expect(component.domOperations).toContain("appendChild");
            expect(component.domOperations).toContain("connectedCallback");

            cleanup();

            expect(component.domOperations).toContain("disconnectedCallback");
        });
    });

    describe("Multiple Component Instances", () => {
        class MultiInstanceComponent extends TestReactiveComponent {
            instanceId: number;
            static nextId = 1;

            constructor() {
                super();
                this.instanceId = MultiInstanceComponent.nextId++;
            }
        }
        customElements.define("test-multi-instance", MultiInstanceComponent);

        it("should maintain separate state/behavior for multiple instances", () => {
            const { component: comp1, cleanup: cleanup1 } = createComponent<MultiInstanceComponent>("test-multi-instance");
            const { component: comp2, cleanup: cleanup2 } = createComponent<MultiInstanceComponent>("test-multi-instance");

            expect(comp1.instanceId).not.toBe(comp2.instanceId);

            cleanup1();
            cleanup2();
        });
    });
});
