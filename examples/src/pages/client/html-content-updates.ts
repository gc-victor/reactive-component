import { define } from "@dist/index.js";

// HTML Content Toggler Component
define("html-toggler", ({ $state, $bind, $element }) => {
    // Initialize state
    $state.isAlternate = false;

    $bind.toggle = () => {
        $state.isAlternate = !$state.isAlternate;
        const initialContent = $element.getState("initialContent") as string;
        $state.content = $state.isAlternate ? '<span class="text-blue-500">Alternate</span> content' : initialContent;
    };

    return {
        connected: () => {
            const content = $element.getState("content");
            if (content) {
                $element.setState("initialContent", content);
            }
        },
    };
});
