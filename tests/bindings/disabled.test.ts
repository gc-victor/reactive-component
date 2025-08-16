import { TestReactiveComponent, createComponent } from "@tests/utils/test-helpers";
import { describe, expect, it } from "vitest";

describe("ReactiveComponent Disabled Binding", () => {
    class DisabledBindingComponent extends TestReactiveComponent {
        isDisabled!: boolean;

        constructor() {
            super();
            this.testSetState("isDisabled", false);
        }
    }
    customElements.define("test-disabled-binding", DisabledBindingComponent);

    it("should bind disabled property to state", () => {
        const { component, cleanup } = createComponent<DisabledBindingComponent>(
            "test-disabled-binding",
            {},
            '<button $bind-disabled="isDisabled">Button</button>',
        );

        const button = component.querySelector("button") as HTMLButtonElement;
        expect(button.disabled).toBe(false);

        component.isDisabled = true;

        expect(button.disabled).toBe(true);
        expect(button.hasAttribute("disabled")).toBe(true);

        cleanup();
    });

    it("should handle disabled binding on input elements", () => {
        const { component, cleanup } = createComponent<DisabledBindingComponent>(
            "test-disabled-binding",
            {},
            '<input $bind-disabled="isDisabled" type="text" />',
        );

        const input = component.querySelector("input") as HTMLInputElement;
        expect(input.disabled).toBe(false);

        component.isDisabled = true;

        expect(input.disabled).toBe(true);
        expect(input.hasAttribute("disabled")).toBe(true);

        cleanup();
    });
});
