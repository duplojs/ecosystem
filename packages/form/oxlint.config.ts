import { engineConfig, createOxlintOverride, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	plugins: ["vue"],
	extends: [engineConfig],
	overrides: [
		createOxlintOverride({
			files: ["**/*"],
			ruleset: { open: true },
			customRules: {
				"typescript/no-unsafe-member-access": "off",
				"typescript/no-unsafe-call": "off",
				"typescript/no-unsafe-argument": "off",
				"typescript/prefer-for-of": "off",
			},
		}),
		createOxlintOverride({
			files: [
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
