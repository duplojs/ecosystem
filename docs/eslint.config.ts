import { createEslintConfig } from "@duplojs/eslint";

export default [
	{
		ignores: [".vitepress/cache/**"],
	},
	createEslintConfig({
		environment: "vue/ts",
		files: ["**/*.vue"],
		ruleset: { base: false },
	}),
];
