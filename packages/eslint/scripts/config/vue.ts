import { baseConfig } from "./base";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import { type FlatConfig } from "typescript-eslint";

export const vueConfig = {
	...baseConfig,
	languageOptions: {
		...baseConfig.languageOptions,
		parser: vueParser,
		parserOptions: {
			...baseConfig.languageOptions.parserOptions,
			parser: tsParser,
			sourceType: "module",
			extraFileExtensions: [".vue"],
		},
	},
	plugins: {
		...baseConfig.plugins,
		vue: pluginVue,
	},
	processor: "vue/vue",
} as const satisfies FlatConfig.Config;
