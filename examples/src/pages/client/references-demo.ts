import { define } from "@dist/index.js";

// Reference Demo Component
define("ref-demo", ({ $state, $on, $ref }) => {
    // Initialize state
    $state.dimensions = "Not measured yet";

    // Use Case 1: Focus Management
    $on.focusUsername = () => {
        const usernameInput = $ref.usernameInput as HTMLInputElement;
        usernameInput?.focus();
    };

    // Use Case 2: DOM Measurements
    $on.measureElement = () => {
        const measureBox = $ref.measureBox as HTMLDivElement;
        const rect = measureBox?.getBoundingClientRect();
        if (rect) {
            $state.dimensions = `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`;
        }
    };
});
