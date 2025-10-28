# Changelog

All notable changes to this project will be documented in this file.

## [0.8.0] - 2025-10-28

### 🚀 Features

- *(core)* [**breaking**] Adopt $on* event attribute prefix for ReactiveComponent
- *(core)* Add $on alias for event handlers

### 🚜 Refactor

- *(examples)* Migrate onclick→$onclick across example sections
- *(examples)* Migrate example components to $on for event handlers
- *(css)* Normalize global.css and adjust [hidden] rule

### 📚 Documentation

- Update docs to use $on* and clarify binding validation
- *(define)* Document $on alias, validation rules, and verification commands
- *(examples)* Prefer $on for event handlers and add data-* guidance
- *(spec)* Sync prompt.txt with $on alias and validation rules

### 🎨 Styling

- *(css)* Reformat Tailwind CSS file in examples

### 🧪 Testing

- *(bindings)* Update event binding tests to $on* convention
- *(define)* Migrate define() event attributes to $onclick/$onsubmit
- *(define)* Add coverage for $on alias and binding validation

### ⚙️ Miscellaneous Tasks

- *(tooling)* Include examples/src in biome check scripts
- *(examples)* Bump tailwind to 4.1.16 and update lockfile
- *(examples)* Add sxo alias for @dist and format config
- *(examples)* Tidy tsconfig formatting and types

### Build

- *(deps-dev)* Bump happy-dom from 20.0.0 to 20.0.2
- *(tsconfig)* Set baseUrl to repo root, fix paths, include tests

## [0.7.0] - 2025-10-14

### 🚀 Features

- *(define)* Add property-based $ref, custom binding handlers, and context interop

### 📚 Documentation

- Update guides for define-first, $ref property API, and custom bindings
- *(rc)* Correct comment typo for isStatusValid

### 🧪 Testing

- *(define)* Add tests for custom bindings and context; migrate $ref to property API
- *(e2e)* Remove deprecated monolithic define e2e test

### ⚙️ Miscellaneous Tasks

- *(examples)* Modularize demos, pin sxo, add dist path alias, update lockfile
- *(release)* Include prompt.txt in package files and add example:test script
- *(tsconfig)* Remove types folder and clean tsconfig references
- *(npm)* Add playwright:install script
- *(e2e)* Add GitHub Actions E2E workflow

## [0.6.1] - 2025-10-13

### 🚀 Features

- *(examples)* Refactor refs demo to focus and DOM measurement use cases

### 📚 Documentation

- *(prompt)* Adopt prompt.txt as authoritative spec

### 🧪 Testing

- *(e2e)* Align context tests with simplified theme-consumer structure 
- *(e2e)* Improve robustness and consistency

### Build

- *(deps-dev)* Bump happy-dom from 19.0.2 to 20.0.0

## [0.6.0] - 2025-10-12

### 🚀 Features

- *(e2e)* Introduce Playwright testing infrastructure

### 🚜 Refactor

- *(build)* Adopt unified ESM architecture

### 📚 Documentation

- *(e2e)* Add Playwright E2E testing guide

## [0.5.0] - 2025-10-10

### 🚀 Features

- Add minified build exports and update package config

### 🚜 Refactor

- Extract ReactiveComponent core to separate rc module
- Restructure index files as export aggregators

### ⚙️ Miscellaneous Tasks

- Fix npm authentication in publish workflow
- *(examples)* Update dependencies and consolidate imports

### Build

- Enhance esbuild configuration for dual outputs

### Deps

- Update major dependencies to latest versions

## [0.4.2] - 2025-10-09

### ⚙️ Miscellaneous Tasks

- Enhance npm publish workflow reliability
- Optimize workflow to run only on relevant file changes
- Migrate publish workflow to pnpm and add manual dispatch
- Refactor publish workflow to use workflow_run trigger
- Update test workflow and optimize triggers

## [0.4.1] - 2025-10-08

### 📚 Documentation

- *(readme)* Revise credits; refine lifecycle example formatting
- *(readme)* Update and clarify documentation

### 🎨 Styling

- Reorder imports in example client index

### ⚙️ Miscellaneous Tasks

- *(makefile)* Streamline release-tag target
- Add GitHub Actions workflows for release, publish, tag, and tests
- *(release)* Implement dynamic changelog range with inline notes
- *(tag)* Add observability improvements to tagging workflow

## [0.4.0] - 2025-09-09

### 🚀 Features

- *(define)* Add function-based component API
- *(examples)* Add examples workspace

### 🚜 Refactor

- *(testing)* Tests refinement and coverage strategy
- *(core)* Minor cleanups and linter fixes in core
- *(define)* Remove observedAttributes override from function-based component class

### 📚 Documentation

- Update changelog
- *(agents)* Add project guidelines and workflow manual
- *(readme)* Document define API and examples
- *(define)* Remove static attrs guidance from define API

### 🎨 Styling

- *(biome)* Update configuration to latest schema
- *(biome)* Adjust includes to ignore declaration files

### 🧪 Testing

- *(define)* Add comprehensive tests for define API
- Clean up imports and mocks across suite to satisfy Biome

### ⚙️ Miscellaneous Tasks

- *(ci)* Remove GitHub Actions workflows
- *(query)* Remove Query config and server/pages code
- *(assets)* Remove cached public webfonts
- *(release)* Revamp Makefile release workflow
- *(types)* Prefer type-only imports in d.ts and annotate $state proxy
- *(lint)* Include tests directory in Biome check scripts
- *(types)* Align d.ts imports; drop obsolete lint suppression

### Build

- Update release targets
- *(esbuild)* Configure bundling and ESM exports
- Stop tracking dist artifact
- Remove .npmignore

## [0.3.0] - 2025-05-20

### 🚀 Features

- *(deps)* Update package dependencies
- Add context api for state sharing

### 🐛 Bug Fixes

- Commit changelog

### 🧪 Testing

- Add tests and coverage tools

### Build

- *(deps)* Update esbuild & tailwindcss
- Add github actions for testing
- Bundle commit
- Update bundle

### Prompt

- Enforce alphanumeric-only values for attributes
- Enhance state management guidelines and binding constraints

### Release

- V0.3.0

## [0.2.1] - 2025-02-10

### 🐛 Bug Fixes

- Directives value validation
- Update changelog

### 📚 Documentation

- Ai assitant development

### Release

- V0.2.1

## [0.2.0] - 2025-02-10

### 🚀 Features

- Create reactive-component

### Release

- V0.2.0

<!-- generated by git-cliff -->
