/**
 * esbuild.config.js
 *
 * Generates a single consolidated output file:
 *   - index.js (ESM, minified, no splitting)
 *
 * Add an npm script (manually) to run this config:
 *   "bundle:esbuild": "node esbuild.config.js"
 */

import { build } from "esbuild";

const buildOptions = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "esm",
    minify: true,
    legalComments: "none",
    outdir: "dist",
    logLevel: "error",
};

async function buildBundle() {
    try {
        await build(buildOptions);
        console.log("✅ Built ESM bundle successfully");
    } catch (err) {
        // Fail loudly for CI; esbuild prints concise errors with logLevel=error
        console.error("Build failed:", err);
        process.exit(1);
    }
}

buildBundle();
