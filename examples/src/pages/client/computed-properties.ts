import { define } from "@dist/index.js";

// Temperature Converter Component
define("temperature-converter", ({ $state, $compute }) => {
    // Initialize state
    $state.celsius = 20;

    // Compute fahrenheit
    $compute("fahrenheit", ["celsius"], (c: unknown) => ((c as number) * 9) / 5 + 32);
});
