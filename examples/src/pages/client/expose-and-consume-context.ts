import { createContext, define } from "@dist/index.js";

// Define our theme context type
interface Theme {
    mode: "light" | "dark";
    background: string;
    text: string;
}

// Theme constants
const LIGHT_THEME: Theme = {
    mode: "light",
    background: "bg-slate-200",
    text: "text-slate-900",
};

const DARK_THEME: Theme = {
    mode: "dark",
    background: "bg-slate-900",
    text: "text-slate-50",
};

const context = createContext("theme");

// Theme Provider Component
define("theme-provider", ({ $state, $bind, $element }) => {
    // Initialize state
    $state.theme = LIGHT_THEME;

    // Expose context
    $element.exposeContext(context);

    // Toggle theme method
    $bind.toggleTheme = () => {
        const currentTheme = $element.getState("theme") as Theme;
        $state.theme = currentTheme.mode === LIGHT_THEME.mode ? DARK_THEME : LIGHT_THEME;
    };
});

// Theme Consumer Component
define("theme-consumer", ({ $state, $compute, $element, $ref, $effect }) => {
    // Consume context
    $element.consumeContext(context);

    // Initialize state
    $state.themeInfo = "Current Theme: light";

    // Computed text bindings
    $compute("themeInfo", [context.state], (theme: unknown) => `Current Theme: ${(theme as Theme).mode}`);

    // Effect to update classes and text
    return {
        connected: () => {
            $effect(() => {
                const themeContext = $element.getState(context.state) as Theme;
                $element.classList.remove(LIGHT_THEME.background, DARK_THEME.background, LIGHT_THEME.text, DARK_THEME.text);
                $element.classList.add(themeContext.background, themeContext.text);

                const themeInfo = $ref.themeInfo as HTMLParagraphElement;
                if (themeInfo) {
                    themeInfo.textContent = `Current Theme: ${themeContext.mode}`;
                }
            });
        },
    };
});
