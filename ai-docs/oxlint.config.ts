import { defineConfig } from "oxlint";
import { openConfig, testPreset } from "@duplojs/code-config/oxlint";

export default defineConfig({
	extends: [openConfig],
	overrides: [
		{
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
			],
			rules: {
				...testPreset.rules,
			},
		},
	],
	ignorePatterns: ["dist/**"],
});
