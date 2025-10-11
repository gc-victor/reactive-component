import { resolve } from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            include: ["src/index.ts", "src/rc.ts", "src/define.ts"],
            exclude: ["**/node_modules/**", "**/dist/**"],
            thresholds: {
                lines: 100,
                functions: 100,
                branches: 100,
                statements: 100,
            },
        },
        typecheck: {
            tsconfig: "./tsconfig.json",
            include: ["src/**/*.ts", "tests/**/*.ts"],
        },
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
            "@tests": resolve(__dirname, "./tests"),
        },
    },
});
