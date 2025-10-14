import { define } from "@dist/index.js";

// Basic Counter Component
define("basic-counter", ({ $state, $bind, $effect }) => {
    // Initialize state
    $state.count = 0;

    // Bind methods
    $bind.increment = () => {
        $state.count++;
    };

    $bind.decrement = () => {
        $state.count--;
    };

    // Create effect to track count changes
    $effect(() => {
        console.log(`Count changed to: ${$state.count}`);
    });
});
