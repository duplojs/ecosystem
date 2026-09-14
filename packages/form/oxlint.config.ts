import { openConfig, testPreset, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	extends: [openConfig],
	rules: {
		"id-length": [
			"error",
			{
				min: 2,
				exceptions: ["t"],
			},
		],
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
	ignorePatterns: [
		"dist/**",
		".commands/**",
		"global.d.ts",
	],
});
