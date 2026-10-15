import { engineConfig, createOxlintOverride, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	extends: [engineConfig],
	overrides: [
		createOxlintOverride({
			files: ["**/*"],
			ruleset: { open: true },
		}),
		createOxlintOverride({
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
			],
			ruleset: { test: true },
		}),
	],
	ignorePatterns: ["dist/**"],
});
