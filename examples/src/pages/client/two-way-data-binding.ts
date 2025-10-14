import { define } from "@dist/index.js";

// Input Echo Component
define("input-echo", ({ $state, $compute }) => {
    // Initialize state
    $state.text = "";

    // Compute uppercase version
    $compute("uppercase", ["text"], (c: unknown) => String(c).toUpperCase());
});
