/**
 * esbuild.config.js
 *
 * Two entry points with settings equivalent to:
 *   esbuild src/index.ts src/define.ts \
 *     --bundle \
 *     --format=esm \
 *     --minify=true \
 *     --legal-comments=none \
 *     --entry-names=[dir]/[name] \
 *     --outdir=dist \
 *     --log-level=error
 *
 * Add an npm script (manually) to run this config:
 *   "bundle:esbuild": "node esbuild.config.js"
 *
 * AIDEV-NOTE: Keep options aligned with Makefile/CLI usage.
 */

import { build } from "esbuild";

const options = {
    entryPoints: ["src/index.ts", "src/define.ts"],
    bundle: true,
    format: "esm",
    minify: true,
    legalComments: "none",
    entryNames: "[dir]/[name]",
    outdir: "dist",
    logLevel: "error",
};

build(options).catch((err) => {
    // Fail loudly for CI; esbuild prints concise errors with logLevel=error
    console.error(err);
    process.exit(1);
});
