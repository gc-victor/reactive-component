import { define } from "@dist/index.js";

// Basic Counter Component
define("basic-counter", ({ $state, $on, $effect }) => {
    // Initialize state
    $state.count = 0;

    // Bind methods
    $on.increment = () => {
        $state.count++;
    };

    $on.decrement = () => {
        $state.count--;
    };

    // Create effect to track count changes
    $effect(() => {
        console.log(`Count changed to: ${$state.count}`);
    });
});
