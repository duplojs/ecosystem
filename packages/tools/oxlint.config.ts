import { openConfig, testPreset, oxlint } from "@duplojs/code-config/oxlint";

export default oxlint.defineConfig({
	extends: [openConfig],
	options: {
		...openConfig.options,
		typeAware: true,
		typeCheck: true,
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
		"coverage/**",
		"dist/**",
		".commands/**",
	],
});
