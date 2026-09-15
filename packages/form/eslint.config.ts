import { vueConfig, oxlintDisabler, type Config } from "@duplojs/eslint";

export default [
	{
		...vueConfig,
		files: ["**/*.vue"],
	} satisfies Config,
	...oxlintDisabler.configs["flat/all"],
];
