// import { define } from "../../../../src/define";
import { createContext, define, ReactiveComponent } from "../../../../src/index";

// Basic Counter Component
class BasicCounter extends ReactiveComponent {
    count!: number;
    connectedCallback() {
        super.connectedCallback();

        // Create effect to track count changes with dependency on count state
        this.effect(() => {
            console.log(`Count changed to: ${this.count}`);
        });
    }

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }
}
customElements.define("basic-counter", BasicCounter);

// Input Echo Component
class InputEcho extends ReactiveComponent {
    constructor() {
        super();
        this.setState("text", "");
        this.compute("uppercase", ["text"], (c) => String(c).toUpperCase());
    }
}
customElements.define("input-echo", InputEcho);

// Temperature Converter Component
class TemperatureConverter extends ReactiveComponent {
    constructor() {
        super();
        this.setState("celsius", 20);
        this.compute("fahrenheit", ["celsius"], (c) => ((c as number) * 9) / 5 + 32);
    }
}
customElements.define("temperature-converter", TemperatureConverter);

// HTML Content Toggler Component
class HtmlToggler extends ReactiveComponent {
    content!: string;
    isAlternate!: boolean;
    initialContent!: string;

    constructor() {
        super();
        this.setState("isAlternate", false);
    }

    connectedCallback() {
        super.connectedCallback();
        const content = this.getState("content");
        if (content) {
            this.setState("initialContent", content);
        }
    }

    toggle() {
        this.isAlternate = !this.isAlternate;
        this.content = this.isAlternate ? '<span class="text-blue-500">Alternate</span> content' : this.initialContent;
    }
}
customElements.define("html-toggler", HtmlToggler);

// Form Demo Component
class FormDemo extends ReactiveComponent {
    constructor() {
        super();
        // Initialize form state
        this.setState("isEnabled", (document.getElementById("enabled") as HTMLInputElement)?.checked ?? false);
        this.setState("inputText", "");

        // Compute disabled state from isEnabled
        // Updates automatically when enabled state changes
        this.compute("isDisabled", ["isEnabled"], (enabled) => !enabled);

        // Compute status message with validation
        // Re-computes when either input text or enabled state changes
        this.compute("status", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
            if (!enabled) return "Input disabled";
            if ((text as string).length < 3) return "Input too short (min 3 characters)";
            return `Input active: ${(text as string).length} characters`;
        });

        // Track class binding for input validation styling
        // Updates when is enabled and the input text changes
        this.compute("isInputValid", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
            return { [(text as string).length >= 3 || !enabled ? "remove" : "add"]: "!border-red-500" };
        });

        // Track class binding for status validation styling
        // Updates when is enabled and the input text changes
        this.compute("isSatusValid", ["isEnabled", "inputText"], (enabled: unknown, text: unknown) => {
            return { [(text as string).length >= 3 || !enabled ? "remove" : "add"]: "!text-red-500" };
        });
    }
}
customElements.define("form-demo", FormDemo);

// Select Field Demo Component
class SelectDemo extends ReactiveComponent {
    constructor() {
        super();
        this.setState("selectedOption", "");

        this.compute("selected", ["selectedOption"], (option) =>
            option ? `${this.querySelector(`[value=${option}]`)?.textContent} (${option})` : "",
        );
    }
}
customElements.define("select-demo", SelectDemo);

// Person Editor Component
class JsonStateManager extends ReactiveComponent {
    constructor() {
        super();
        this.setState("name", "Paco Doe");
        this.setState("age", 30);
        this.setState("bio", "");

        // Compute JSON representation
        this.compute("json", ["name", "age", "bio"], (name, age, bio) => JSON.stringify({ name, age, bio }, null, 2));
    }
}
customElements.define("json-state-management", JsonStateManager);

// Reference Demo Component
class RefDemo extends ReactiveComponent {
    outputColor!: string;
    constructor() {
        super();
        this.setState("outputText", "Initial Text");
        this.setState("outputColor", "black");
    }

    updateText() {
        this.refs.output.textContent = this.refs.output.textContent === "Initial Text" ? "Updated Text Content" : "Initial Text";
    }

    updateColor() {
        this.outputColor = this.outputColor === "black" ? "#f6339a" : "black";
        this.refs.output.style.color = this.outputColor;
    }
}
customElements.define("ref-demo", RefDemo);

// Custom Progress Binding with Progress Bar
class CustomProgressBinding extends ReactiveComponent {
    progressValue!: number;
    private progressInterval: number | null = null;

    constructor() {
        super();
        // Initialize state for progress value and status
        this.setState("progressValue", 0);
        this.setState("status", "Starting...");

        // Compute the loading status based on progress value
        this.compute("loadingStatus", ["progressValue"], (value: unknown) => {
            if ((value as number) >= 100) return "Complete!";
            if ((value as number) > 0) return `Loading: ${value as number}%`;
            return "Starting...";
        });
    }

    private updateButtonsState(isRunning: boolean): void {
        if (this.refs.startButton instanceof HTMLButtonElement) {
            this.refs.startButton.disabled = isRunning;
        }
        if (this.refs.stopButton instanceof HTMLButtonElement) {
            this.refs.stopButton.disabled = !isRunning;
        }
    }

    protected customBindingHandlers({ element, rawValue }: { element: HTMLElement; rawValue: number }): Record<string, () => void> {
        return {
            progress: () => {
                if (element instanceof HTMLProgressElement) {
                    // Update progress value
                    element.value = rawValue || 0;
                    element.max = 100;
                }
            },
        };
    }

    // Method to simulate progress
    startProgress() {
        let value = this.progressValue && this.progressValue !== 100 ? this.progressValue : 0;
        // Clear any existing interval
        this.stopProgress();

        // Update button states for running state
        this.updateButtonsState(true);

        this.progressInterval = window.setInterval(() => {
            if (value >= 100) {
                this.stopProgress();
            } else {
                value += 10;
                this.progressValue = value;
            }
        }, 500);
    }

    // Method to stop progress simulation
    stopProgress() {
        if (this.progressInterval) {
            window.clearInterval(this.progressInterval);
            this.progressInterval = null;

            // Update button states for stopped state
            this.updateButtonsState(false);
        }
    }
}
customElements.define("custom-progress-binding", CustomProgressBinding);

// Password Toggle Component
class PasswordToggle extends ReactiveComponent {
    isPasswordVisible!: boolean;

    constructor() {
        super();

        // Initialize core state
        this.setState("isPasswordVisible", false);
    }

    toggleVisibility() {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    // Custom binding handler for icon visibility
    customBindingHandlers({ element, rawValue }: { element: HTMLElement; rawValue: boolean }): Record<string, () => void> {
        return {
            "icon-visibility": () => {
                const key = element.dataset.icon;
                const state: Record<string, string> = {
                    hide: rawValue ? "block" : "none",
                    show: rawValue ? "none" : "block",
                };
                element.style.display = state[key as keyof typeof state];
            },
            type: () => {
                if (element instanceof HTMLInputElement) {
                    element.type = rawValue ? "text" : "password";
                }
            },
        };
    }
}
// Register the custom element
customElements.define("password-toggle", PasswordToggle);

// Define our theme context type
interface Theme {
    mode: "light" | "dark";
    background: string;
    text: string;
}

// Theme Provider Component
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

class ThemeProvider extends ReactiveComponent {
    constructor() {
        super();

        this.setState("theme", LIGHT_THEME);

        this.exposeContext(context);
    }

    toggleTheme() {
        const currentTheme = this.getState("theme") as Theme;
        this.setState("theme", currentTheme.mode === LIGHT_THEME.mode ? DARK_THEME : LIGHT_THEME);
    }
}
customElements.define("theme-provider", ThemeProvider);

// Theme Consumer Component
class ThemeConsumer extends ReactiveComponent {
    mode!: string;
    buttonTheme!: string;
    themeMode!: string;

    constructor() {
        super();

        this.consumeContext(context);

        this.setState("themeMode", "ThemeMode: light");
        this.setState("buttonTheme", "ButtonTheme: light");

        this.compute("themeMode", [context.state], (theme: Theme) => {
            return `ThemeMode: ${theme.mode}`;
        });

        this.compute("buttonTheme", [context.state], (theme: Theme) => {
            return `ButtonTheme: ${theme.mode}`;
        });
    }

    connectedCallback() {
        super.connectedCallback();

        this.effect(() => {
            const context = this.getThemeContext();

            this.classList.remove(LIGHT_THEME.background, DARK_THEME.background, LIGHT_THEME.text, DARK_THEME.text);
            this.classList.add(context.background, context.text);
            this.refs.themeInfo.textContent = `Current Theme: ${context.mode}`;
        });
    }

    private getThemeContext(): Theme {
        return this.getState(context.state) as Theme;
    }
}
customElements.define("theme-consumer", ThemeConsumer);

// Define a custom element for a counter
define("define-counter", ({ $state, $bind }) => {
    // Bind methods
    $bind.increment = () => {
        $state.count++;
    };

    $bind.decrement = () => {
        $state.count--;
    };

    $bind.reset = () => {
        $state.count = 0;
    };
});
