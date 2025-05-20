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
            include: ["src/index.ts"],
            exclude: ["**/node_modules/**", "**/dist/**"],
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
