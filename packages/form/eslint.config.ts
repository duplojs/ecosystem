import { createEslintConfig } from "@duplojs/eslint";

export default [
	createEslintConfig({
		environment: "vue/ts",
		files: ["**/*.vue"],
		ruleset: { base: false },
	}),
];
