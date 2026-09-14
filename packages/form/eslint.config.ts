import { vueConfig, oxlint, type Config } from "@duplojs/eslint";

export default [
	{
		...vueConfig,
		files: ["**/*.vue"],
	} satisfies Config,
	...oxlint.configs["flat/all"],
];
