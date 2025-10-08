/**
 * esbuild.config.js
 *
 * Generates four output files:
 *   - index.js (ESM, non-minified)
 *   - define.js (ESM, non-minified)
 *   - index.min.js (ESM, minified)
 *   - define.min.js (ESM, minified)
 *
 * Add an npm script (manually) to run this config:
 *   "bundle:esbuild": "node esbuild.config.js"
 *
 * AIDEV-NOTE: Keep options aligned with Makefile/CLI usage.
 */

import { build } from "esbuild";

const baseOptions = {
    entryPoints: {
        index: "src/index.ts",
        define: "src/define.ts",
    },
    bundle: true,
    format: "esm",
    legalComments: "none",
    outdir: "dist",
    logLevel: "error",
};

// Non-minified build
const nonMinifiedOptions = {
    ...baseOptions,
    minify: false,
    entryNames: "[dir]/[name]",
};

// Minified build
const minifiedOptions = {
    ...baseOptions,
    minify: true,
    entryNames: "[dir]/[name].min",
};

async function buildAll() {
    try {
        // Build non-minified versions
        await build(nonMinifiedOptions);

        // Build minified versions
        await build(minifiedOptions);

        console.log("✅ Built all ESM bundles successfully");
    } catch (err) {
        // Fail loudly for CI; esbuild prints concise errors with logLevel=error
        console.error("❌ Build failed:", err);
        process.exit(1);
    }
}

buildAll();
