import { define } from "@dist/index.js";

// Select Field Demo Component
define("select-demo", ({ $state, $compute, $element }) => {
    // Initialize state
    $state.selectedOption = "";

    // Compute selected option display
    $compute("selected", ["selectedOption"], (option: unknown) =>
        option ? `${$element.querySelector(`[value="${CSS.escape(option as string)}"]`)?.textContent} (${option as string})` : "",
    );
});
