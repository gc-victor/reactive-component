import { define } from "@dist/index.js";

// Form Demo Component
define("form-demo", ({ $state, $compute }) => {
    // Initialize form state
    $state.isEnabled = (document.getElementById("enabled") as HTMLInputElement)?.checked ?? false;
    $state.inputText = "";

    // Compute disabled state from isEnabled
    $compute("isDisabled", ["isEnabled"], (enabled: unknown) => !(enabled as boolean));

    // Compute status message with validation
    $compute("status", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
        if (!enabled) return "Input disabled";
        if ((text as string).length < 3) return "Input too short (min 3 characters)";
        return `Input active: ${(text as string).length} characters`;
    });

    // Track class binding for input validation styling
    $compute("isInputValid", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
        return { [(text as string).length >= 3 || !enabled ? "remove" : "add"]: "!border-red-500" };
    });

    // Track class binding for status validation styling
    $compute("isStatusValid", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
        return { [(text as string).length >= 3 || !enabled ? "remove" : "add"]: "!text-red-500" };
    });
});
