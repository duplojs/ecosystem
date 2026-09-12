import { defineConfig } from "oxlint";
import { openConfig, testPreset } from "./dist/oxlint/index.mjs";

export default defineConfig({
	extends: [openConfig],
	options: {
		...openConfig.options,
		typeAware: true,
	},
	overrides: [
		{
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integration/**/*.ts",
			],
			rules: {
				...testPreset.rules,
			},
		},
	],
});
