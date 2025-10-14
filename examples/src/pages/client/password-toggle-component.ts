import { define } from "@dist/index.js";

// Password Toggle Component
define("password-toggle", ({ $state, $bind, $customBindingHandlers }) => {
    // Initialize state
    $state.isPasswordVisible = false;

    // Bind toggle method
    $bind.toggleVisibility = () => {
        $state.isPasswordVisible = !$state.isPasswordVisible;
    };

    // Custom binding handler for icon visibility
    $customBindingHandlers["icon-visibility"] = ({ element, rawValue }) => {
        const key = element.dataset.icon;
        const state: Record<string, string> = {
            hide: (rawValue as boolean) ? "block" : "none",
            show: (rawValue as boolean) ? "none" : "block",
        };
        element.style.display = state[key as keyof typeof state];
    };

    // Custom binding handler for input type
    $customBindingHandlers.type = ({ element, rawValue }) => {
        if (element instanceof HTMLInputElement) {
            element.type = (rawValue as boolean) ? "text" : "password";
        }
    };
});
