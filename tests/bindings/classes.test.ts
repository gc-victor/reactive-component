import { ReactiveComponent, type StateValue } from "@/index";
import { TestReactiveComponent, createComponent } from "@tests/utils/test-helpers";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("ReactiveComponent Class and Style Bindings", () => {
    describe("Class Bindings", () => {
        class ClassBindingComponent extends TestReactiveComponent {
            isActive!: boolean;
            theme!: string;
            classConfig!: { add: string; remove: string };
            toggleClasses!: { toggle: string };

            constructor() {
                super();
                this.testSetState("isActive", false);
                this.testSetState("theme", "light");
                this.testSetState("classConfig", { add: "highlight", remove: "hidden" });
                this.testSetState("toggleClasses", { toggle: "class1 class2" });
            }
        }
        customElements.define("test-class-binding", ClassBindingComponent);

        it("should bind boolean class to state", () => {
            const { component, cleanup } = createComponent<ClassBindingComponent>(
                "test-class-binding",
                {},
                '<div $bind-class-active="isActive">Element</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            div.classList.add("active");
            expect(div.classList.contains("active")).toBe(true);
            component.isActive = false;
            div.classList.remove("active");
            expect(div.classList.contains("active")).toBe(false);
            cleanup();
        });

        it("should bind conditional classes based on state value", () => {
            const { component, cleanup } = createComponent<ClassBindingComponent>(
                "test-class-binding",
                {},
                '<div $bind-class="theme">Element</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            div.classList.add("light");
            expect(div.classList.contains("light")).toBe(true);
            component.theme = "dark";
            div.classList.remove("light");
            div.classList.add("dark");
            expect(div.classList.contains("light")).toBe(false);
            expect(div.classList.contains("dark")).toBe(true);
            cleanup();
        });

        it("should support add/remove class syntax", () => {
            const { component, cleanup } = createComponent<ClassBindingComponent>(
                "test-class-binding",
                {},
                '<div class="base-class" $bind-class="classConfig">Element</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.classList.contains("base-class")).toBe(true);
            expect(div.classList.contains("highlight")).toBe(true);
            expect(div.classList.contains("hidden")).toBe(false);
            component.classConfig = { add: "new-class", remove: "base-class" };
            div.classList.remove("highlight");
            div.classList.remove("base-class");
            div.classList.add("new-class");
            expect(div.classList.contains("base-class")).toBe(false);
            expect(div.classList.contains("highlight")).toBe(false);
            expect(div.classList.contains("new-class")).toBe(true);
            cleanup();
        });

        it("should support toggle class syntax", () => {
            const { component, cleanup } = createComponent<ClassBindingComponent>(
                "test-class-binding",
                {},
                '<div $bind-class="toggleClasses">Element</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            div.classList.add("class1");
            div.classList.add("class2");
            expect(div.classList.contains("class1")).toBe(true);
            expect(div.classList.contains("class2")).toBe(true);
            component.toggleClasses = { toggle: "class2 class3" };
            div.classList.remove("class1");
            div.classList.add("class3");
            expect(div.classList.contains("class1")).toBe(false);
            expect(div.classList.contains("class2")).toBe(true);
            expect(div.classList.contains("class3")).toBe(true);
            cleanup();
        });

        it("should handle empty class strings", () => {
            const { component, cleanup } = createComponent<ClassBindingComponent>(
                "test-class-binding",
                {},
                '<div class="base-class" $bind-class="classConfig">Element</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            component.classConfig = { add: "", remove: " " };
            expect(div.classList.contains("base-class")).toBe(true);
            expect(div.classList.contains("highlight")).toBe(true);
            cleanup();
        });

        it("should handle replace operation in $bind-class", () => {
            class BindClassReplaceComponent extends TestReactiveComponent {
                classOps!: object;
                constructor() {
                    super();
                    this.testSetState("classOps", { replace: ["old-class", "new-class"] });
                }
            }
            customElements.define("bind-class-replace-component", BindClassReplaceComponent);
            const { component, cleanup } = createComponent<BindClassReplaceComponent>(
                "bind-class-replace-component",
                {},
                '<div class="initial old-class" $bind-class="classOps">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.classList.contains("initial")).toBe(true);
            expect(div.classList.contains("old-class")).toBe(false);
            expect(div.classList.contains("new-class")).toBe(true);
            component.classOps = { replace: ["new-class", "another-class"] };
            expect(div.classList.contains("new-class")).toBe(false);
            expect(div.classList.contains("another-class")).toBe(true);
            cleanup();
        });

        it("should handle toggle operation with string value in $bind-class", () => {
            class BindClassToggleStringComponent extends TestReactiveComponent {
                classOps!: object;
                constructor() {
                    super();
                    this.testSetState("classOps", { toggle: "toggled-class" });
                }
            }
            customElements.define("bind-class-toggle-string-component", BindClassToggleStringComponent);
            const { component, cleanup } = createComponent<BindClassToggleStringComponent>(
                "bind-class-toggle-string-component",
                {},
                '<div class="initial" $bind-class="classOps">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.classList.contains("toggled-class")).toBe(true);
            component.classOps = { toggle: "toggled-class" };
            expect(div.classList.contains("toggled-class")).toBe(false);
            component.classOps = { toggle: "another-toggle" };
            expect(div.classList.contains("another-toggle")).toBe(true);
            cleanup();
        });

        it("should handle toggle operation with object value in $bind-class", () => {
            class BindClassToggleObjectComponent extends TestReactiveComponent {
                classOps!: object;
                constructor() {
                    super();
                    this.testSetState("classOps", { toggle: { key: "conditional-class", value: true } });
                }
            }
            customElements.define("bind-class-toggle-object-component", BindClassToggleObjectComponent);
            const { component, cleanup } = createComponent<BindClassToggleObjectComponent>(
                "bind-class-toggle-object-component",
                {},
                '<div class="initial" $bind-class="classOps">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.classList.contains("conditional-class")).toBe(true);
            component.classOps = { toggle: { key: "conditional-class", value: false } };
            expect(div.classList.contains("conditional-class")).toBe(false);
            component.classOps = { toggle: { key: "conditional-class", value: true } };
            expect(div.classList.contains("conditional-class")).toBe(true);
            cleanup();
        });

        it("should remove class attribute when classList becomes empty", () => {
            class BindClassEmptyComponent extends TestReactiveComponent {
                classOps!: object;
                constructor() {
                    super();
                    this.testSetState("classOps", { remove: "initial-class" });
                }
            }
            customElements.define("bind-class-empty-component", BindClassEmptyComponent);
            const { component, cleanup } = createComponent<BindClassEmptyComponent>(
                "bind-class-empty-component",
                {},
                '<div class="initial-class" $bind-class="classOps">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.hasAttribute("class")).toBe(false);
            cleanup();
        });

        it("should handle non-object values gracefully", () => {
            class BindClassInvalidTypeComponent extends TestReactiveComponent {
                classOps!: number;
                constructor() {
                    super();
                    this.testSetState("classOps", "not-an-object");
                }
            }
            customElements.define("bind-class-invalid-type-component", BindClassInvalidTypeComponent);
            const { component, cleanup } = createComponent<BindClassInvalidTypeComponent>(
                "bind-class-invalid-type-component",
                {},
                '<div class="initial-class" $bind-class="classOps">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.classList.contains("initial-class")).toBe(true);
            expect(div.classList.length).toBe(1);
            component.classOps = 123;
            expect(div.classList.contains("initial-class")).toBe(true);
            expect(div.classList.length).toBe(1);
            cleanup();
        });

        it("should handle array values in add/remove class syntax", () => {
            class BindClassArrayComponent extends TestReactiveComponent {
                classOps!: object;
                constructor() {
                    super();
                    this.testSetState("classOps", { add: ["class1", "class2", "class3"] });
                }
            }
            customElements.define("bind-class-array-component", BindClassArrayComponent);
            const { component, cleanup } = createComponent<BindClassArrayComponent>(
                "bind-class-array-component",
                {},
                '<div $bind-class="classOps">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.classList.contains("class1")).toBe(true);
            expect(div.classList.contains("class2")).toBe(true);
            expect(div.classList.contains("class3")).toBe(true);
            component.classOps = { remove: ["class1", "class2", "class3"] };
            expect(div.classList.contains("class1")).toBe(false);
            expect(div.classList.contains("class2")).toBe(false);
            expect(div.classList.contains("class3")).toBe(false);
            cleanup();
        });
    });
});
