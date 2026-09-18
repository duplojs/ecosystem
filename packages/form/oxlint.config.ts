import { openConfig, testPreset, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	plugins: ["vue"],
	extends: [openConfig],
	rules: {
		"typescript/no-unsafe-member-access": "off",
		"typescript/no-unsafe-call": "off",
		"typescript/no-unsafe-argument": "off",
		"typescript/prefer-for-of": "off",
	},
	overrides: [
		{
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
			],
			excludeFiles: ["**/*.d.ts"],
			rules: {
				...testPreset.rules,
				"typescript/no-confusing-void-expression": "off",
			},
		},
	],
	ignorePatterns: ["dist/**"],
});
