import { defineConfig } from "oxlint";
import { pluginSpecifier } from "./plugin";

export const engineConfig = defineConfig({
	plugins: ["typescript", "eslint"],
	jsPlugins: [
		{
			name: "duplojs-plugin",
			specifier: pluginSpecifier,
		},
		{
			name: "@stylistic",
			specifier: "@stylistic/eslint-plugin",
		},
	],
	categories: {
		correctness: "off",
		nursery: "off",
		pedantic: "off",
		perf: "off",
		restriction: "off",
		style: "off",
		suspicious: "off",
	},
	options: {
		typeAware: true,
		reportUnusedDisableDirectives: "error",
		respectEslintDisableDirectives: true,
	},
});
