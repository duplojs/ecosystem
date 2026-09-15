import parserTs from "@typescript-eslint/parser";
import tslint from "@typescript-eslint/eslint-plugin";
import stylistic from "@stylistic/eslint-plugin";
import { type FlatConfig } from "typescript-eslint";

export const baseConfig = {
	plugins: {
		"@stylistic": stylistic,
		"@typescript-eslint": tslint,
	},
	languageOptions: {
		parser: parserTs,
		parserOptions: {
			projectService: true,
		},
	},
} as const satisfies FlatConfig.Config;
