# @duplojs/code-config

[![NPM version](https://img.shields.io/npm/v/@duplojs/code-config)](https://www.npmjs.com/package/@duplojs/code-config)

## Install

```bash
npm install @duplojs/code-config
```

## Oxlint

Extend `engineConfig` to load the shared plugins and engine options. Compose the
rules for each group of files with `createOxlintOverride`:

```ts
import { engineConfig, createOxlintOverride, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	extends: [engineConfig],
	ignorePatterns: ["dist/**", "coverage/**"],
	overrides: [
		createOxlintOverride({
			files: ["**/*.ts"],
			ruleset: { open: true },
		}),
		createOxlintOverride({
			files: ["**/*.test.ts", "**/*.bench.ts"],
			ruleset: { test: true },
			customRules: { "no-eval": "error" },
		}),
	],
});
```

The base rules are enabled by default. `open` and `test` are opt-in. Rules are
composed in this order: `base`, `open`, `test`, then `customRules`.
Use `ruleset: { base: false }` for an override containing only the selected
optional rulesets and custom rules. This does not disable rules inherited from
another matching override or the root configuration; use `customRules` with
`"off"` or exclude those files from the earlier override when needed.

The factory returns one `OxlintOverride` object and also accepts native override
fields such as `excludeFiles`, `env`, `globals`, `plugins`, and `jsPlugins`.
