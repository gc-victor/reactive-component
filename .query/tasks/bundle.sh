#!/bin/sh

ESBUILD=node_modules/.bin/esbuild

if [ "$PROD" = "true" ]; then
    reactive_component() {
        $ESBUILD src/index.ts \
            --bundle \
            --format=esm \
            --minify=true \
            --legal-comments=none \
            --entry-names=[dir]/[name] \
            --outdir=dist \
            --log-level=error
    }

    reactive_component
else
    island_components() {
        ISLAND_COMPONENTS_PUBLIC=$(find src/pages/ -name '*.island.*')

        $ESBUILD $ISLAND_COMPONENTS_PUBLIC \
            --bundle \
            --format=esm \
            --minify=true \
            --legal-comments=none \
            --entry-names=[dir]/[name] \
            --public-path=/_/asset/dist \
            --outdir=dist \
            --log-level=error \
            --sourcemap=inline
    }

    island_components
fi
