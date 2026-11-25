import { baseRules, engineConfig, createOxlintOverride, oxlint } from "@duplojs/code-config/oxlint";

const [, listStyle] = baseRules["@stylistic/list-style"];

export default oxlint.defineConfig({
	plugins: ["vue"],
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
		createOxlintOverride({
			files: ["docs/**/*", "skills/**/*"],
			ruleset: { base: false },
			customRules: {
				"@stylistic/list-style": [
					"error",
					{
						...listStyle,
						overrides: {
							...listStyle.overrides,
							"[]": { singleLine: { maxItems: 1000 } },
						},
					},
				],
			},
		}),
	],
	ignorePatterns: [
		"dist/**",
		// Copie inchangée de la sortie Rolldown utilisée par la documentation.
		"docs/API/30-http/90-plugins/10-code-generator/fixtures/routes.d.ts",
	],
});
