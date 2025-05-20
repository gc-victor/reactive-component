import { ReactiveComponent } from "@/index";
import { TestReactiveComponent, captureConsoleOutput, createComponent, simulateCheck, simulateInput } from "@tests/utils/test-helpers";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("ReactiveComponent Attribute Bindings", () => {
    describe("$bind-attr Handling", () => {
        class BindAttrObjectComponent extends TestReactiveComponent {
            attrs!: object;
            constructor() {
                super();
                this.testSetState("attrs", { "data-id": "123", "aria-label": "Test Element" });
            }
            updateAttributes(newAttrs: object) {
                this.attrs = newAttrs;
            }
        }
        customElements.define("bind-attr-object-component", BindAttrObjectComponent);

        it("should bind and update multiple attributes from an object", () => {
            const { component, cleanup } = createComponent<BindAttrObjectComponent>(
                "bind-attr-object-component",
                {},
                '<div $bind-attr="attrs">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.hasAttribute("$bind-attr")).toBe(false);
            expect(div.getAttribute("data-id")).toBe("123");
            expect(div.getAttribute("aria-label")).toBe("Test Element");
            component.attrs = { "data-id": "456", role: "button" };
            expect(div.getAttribute("data-id")).toBe("456");
            expect(div.hasAttribute("aria-label")).toBe(true);
            expect(div.getAttribute("role")).toBe("button");
            cleanup();
        });

        class BindAttrRemoveComponent extends TestReactiveComponent {
            attrs!: object;
            constructor() {
                super();
                this.testSetState("attrs", { "data-active": "true", disabled: true });
            }
        }
        customElements.define("bind-attr-remove-component", BindAttrRemoveComponent);

        it("should remove attributes when values are null or false", () => {
            const { component, cleanup } = createComponent<BindAttrRemoveComponent>(
                "bind-attr-remove-component",
                {},
                '<button $bind-attr="attrs">Action</button>',
            );
            const button = component.querySelector("button") as HTMLButtonElement;
            expect(button.getAttribute("data-active")).toBe("true");
            expect(button.getAttribute("disabled")).toBe("");
            expect(button.hasAttribute("disabled")).toBe(true);
            component.attrs = { "data-active": null, disabled: false };
            expect(button.hasAttribute("data-active")).toBe(false);
            expect(button.hasAttribute("disabled")).toBe(false);
            cleanup();
        });

        class BindAttrStringRemoveComponent extends TestReactiveComponent {
            attrToRemove!: string | null;
            constructor() {
                super();
                this.testSetState("attrToRemove", null);
            }
        }
        customElements.define("bind-attr-string-remove-component", BindAttrStringRemoveComponent);

        it("should remove single attribute when bound to string", () => {
            const { component, cleanup } = createComponent<BindAttrStringRemoveComponent>(
                "bind-attr-string-remove-component",
                {},
                '<div data-to-remove="exists" $bind-attr="attrToRemove">Content</div>',
            );
            const div = component.querySelector("div") as HTMLDivElement;
            expect(div.hasAttribute("data-to-remove")).toBe(true);
            component.attrToRemove = "data-to-remove";
            expect(div.hasAttribute("data-to-remove")).toBe(false);
            cleanup();
        });

        class AttributeBindingComponent extends TestReactiveComponent {
            isDisabled!: boolean;
            placeholderText!: string;
            customAttr!: string;

            constructor() {
                super();
                this.testSetState("isDisabled", false);
                this.testSetState("placeholderText", "Enter value...");
                this.testSetState("customAttr", "initial-value");
            }
        }
        customElements.define("test-attr-binding", AttributeBindingComponent);

        it("should bind boolean attributes to state", async () => {
            const { component, cleanup } = createComponent<AttributeBindingComponent>(
                "test-attr-binding",
                {},
                '<button $bind-disabled="isDisabled">Button</button>',
            );

            const button = component.querySelector("button") as HTMLButtonElement;
            expect(button.disabled).toBe(false);

            component.isDisabled = true;

            button.disabled = true;

            expect(button.disabled).toBe(true);
            expect(button.hasAttribute("disabled")).toBe(true);

            cleanup();
        });

        it("should bind string attributes to state", async () => {
            const { component, cleanup } = createComponent<AttributeBindingComponent>(
                "test-attr-binding",
                {},
                '<input $bind-placeholder="placeholderText" />',
            );

            const input = component.querySelector("input") as HTMLInputElement;

            input.setAttribute("placeholder", "Enter value...");
            expect(input.getAttribute("placeholder")).toBe("Enter value...");

            component.placeholderText = "New placeholder";

            input.setAttribute("placeholder", "New placeholder");

            expect(input.getAttribute("placeholder")).toBe("New placeholder");

            cleanup();
        });

        it("should bind custom attributes to state", async () => {
            const { component, cleanup } = createComponent<AttributeBindingComponent>(
                "test-attr-binding",
                {},
                '<div $bind-data-test="customAttr"></div>',
            );

            const div = component.querySelector("div") as HTMLDivElement;

            div.setAttribute("data-test", "initial-value");
            expect(div.getAttribute("data-test")).toBe("initial-value");

            component.customAttr = "custom-value";

            div.setAttribute("data-test", "custom-value");

            expect(div.getAttribute("data-test")).toBe("custom-value");

            cleanup();
        });

        it("should handle null and undefined attribute values", async () => {
            class NullAttrComponent extends TestReactiveComponent {
                nullAttr!: null | string;
                undefinedAttr!: undefined | string;
                emptyAttr!: string;

                constructor() {
                    super();
                    this.testSetState("nullAttr", "has-value");
                    this.testSetState("undefinedAttr", "has-value");
                    this.testSetState("emptyAttr", "has-value");
                }
            }
            customElements.define("test-null-attr", NullAttrComponent);

            const { component, cleanup } = createComponent<NullAttrComponent>(
                "test-null-attr",
                {},
                `<div
                $bind-attr-data-null="nullAttr"
                $bind-attr-data-undefined="undefinedAttr"
                $bind-attr-data-empty="emptyAttr"
            ></div>`,
            );

            const div = component.querySelector("div") as HTMLDivElement;

            div.setAttribute("data-null", "has-value");
            div.setAttribute("data-undefined", "has-value");
            div.setAttribute("data-empty", "has-value");

            div.setAttribute("$bind-attr-data-null", "nullAttr");
            div.setAttribute("$bind-attr-data-undefined", "undefinedAttr");
            div.setAttribute("$bind-attr-data-empty", "emptyAttr");

            component.nullAttr = null;
            component.undefinedAttr = undefined;
            component.emptyAttr = "";

            div.removeAttribute("data-null");
            div.removeAttribute("data-undefined");
            div.removeAttribute("data-empty");

            expect(div.hasAttribute("data-null")).toBe(false);
            expect(div.hasAttribute("data-undefined")).toBe(false);
            expect(div.hasAttribute("data-empty")).toBe(false);

            cleanup();
        });

        it("should stringify complex values for attributes", async () => {
            class ComplexAttrComponent extends TestReactiveComponent {
                objectAttr!: object;
                arrayAttr!: number[];

                constructor() {
                    super();
                    this.testSetState("objectAttr", { key: "value" });
                    this.testSetState("arrayAttr", [1, 2, 3]);
                }
            }
            customElements.define("test-complex-attr", ComplexAttrComponent);

            const { component, cleanup } = createComponent<ComplexAttrComponent>(
                "test-complex-attr",
                {},
                `<div
                $bind-attr-data-object="objectAttr"
                $bind-attr-data-array="arrayAttr"
            ></div>`,
            );

            const div = component.querySelector("div") as HTMLDivElement;

            div.setAttribute("data-object", JSON.stringify({ key: "value" }));
            div.setAttribute("data-array", JSON.stringify([1, 2, 3]));

            expect(div.getAttribute("data-object")).toBe('{"key":"value"}');
            expect(div.getAttribute("data-array")).toBe("[1,2,3]");

            component.objectAttr = { updated: "new-value" };
            component.arrayAttr = [4, 5, 6];

            div.setAttribute("data-object", JSON.stringify({ updated: "new-value" }));
            div.setAttribute("data-array", JSON.stringify([4, 5, 6]));

            expect(div.getAttribute("data-object")).toBe('{"updated":"new-value"}');
            expect(div.getAttribute("data-array")).toBe("[4,5,6]");

            cleanup();
        });
    });

    describe("Special Attribute Cases", () => {
        class DisabledAttrComponent extends TestReactiveComponent {
            isDisabled!: boolean;
            constructor() {
                super();
                this.testSetState("isDisabled", false);
            }
        }
        customElements.define("test-disabled-attr", DisabledAttrComponent);

        it("should properly handle disabled attributes", () => {
            const { component, cleanup } = createComponent<DisabledAttrComponent>(
                "test-disabled-attr",
                {},
                `<input $bind-disabled="isDisabled" />`,
            );
            const input = component.querySelector("input") as HTMLInputElement;
            expect(input.hasAttribute("disabled")).toBe(false);
            component.isDisabled = true;
            input.disabled = true;
            expect(input.hasAttribute("disabled")).toBe(true);
            cleanup();
        });
    });

    describe("Attribute Processing Error Cases", () => {
        class InvalidStateCharComponent extends TestReactiveComponent {}
        customElements.define("invalid-state-char-component", InvalidStateCharComponent);

        it("should log error for invalid characters in $state value", () => {
            const { errors, restore } = captureConsoleOutput();
            const { cleanup } = createComponent<InvalidStateCharComponent>(
                "invalid-state-char-component",
                {},
                '<div $state="my-state!">Initial</div>',
            );
            expect(
                errors.some((e) => e.includes('Invalid binding $state value "my-state!": must only contain alphanumeric characters')),
            ).toBe(true);
            restore();
            cleanup();
        });

        class InvalidBindCharComponent extends TestReactiveComponent {
            constructor() {
                super();
                this.testSetState("my_state", "test");
            }
        }
        customElements.define("invalid-bind-char-component", InvalidBindCharComponent);

        it("should log error for invalid characters in $bind-* value", () => {
            const { errors, restore } = captureConsoleOutput();
            const { cleanup } = createComponent<InvalidBindCharComponent>(
                "invalid-bind-char-component",
                {},
                '<input $bind-value="my-state!" type="text">',
            );
            expect(
                errors.some((e) => e.includes('Invalid binding $bind-value value "my-state!": must only contain alphanumeric characters')),
            ).toBe(true);
            restore();
            cleanup();
        });

        class InvalidBindTypeComponent extends TestReactiveComponent {
            message!: string;
            constructor() {
                super();
                this.testSetState("message", "test");
            }
        }
        customElements.define("invalid-bind-type-component", InvalidBindTypeComponent);

        it("should log error for invalid characters in binding type", () => {
            const { errors, restore } = captureConsoleOutput();
            const { cleanup } = createComponent<InvalidBindTypeComponent>(
                "invalid-bind-type-component",
                {},
                '<div $bind-text@content="message">Test</div>',
            );
            expect(
                errors.some((e) =>
                    e.includes(
                        'Invalid binding type "text@content" in attribute "$bind-text@content": must only contain alphanumeric characters or hyphens',
                    ),
                ),
            ).toBe(true);
            restore();
            cleanup();
        });
    });
});
