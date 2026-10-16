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
				"docs/**/*.ts",
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
			],
			excludeFiles: ["**/*.d.ts"],
			ruleset: { test: true },
			customRules: {
				"typescript/no-confusing-void-expression": "off",
			},
		}),
	],
	ignorePatterns: ["dist/**"],
});
