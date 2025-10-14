import { define } from "@dist/index.js";

// Person Editor Component
define("json-state-management", ({ $state, $compute }) => {
    // Initialize state
    $state.name = "Paco Doe";
    $state.age = 30;
    $state.bio = "";

    // Compute JSON representation
    $compute("json", ["name", "age", "bio"], (name: unknown, age: unknown, bio: unknown) => JSON.stringify({ name, age, bio }, null, 2));
});
