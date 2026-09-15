import { type FlatConfig } from "typescript-eslint";
import { baseConfig, vueConfig } from "./config";
import { baseRules, openRules, testRules, vueRules } from "./rules";

export type Environment = "vue/ts" | "ts";

export interface Ruleset {
	base?: boolean;
	open?: boolean;
	test?: boolean;
	vue?: boolean;
}

export interface CreateEslintConfigParams {
	environment: "vue/ts" | "ts";
	ruleset?: Ruleset;
	customRules?: FlatConfig.Rules;
	files: (string | string[])[];
}

const environmentMapper: Record<Environment, FlatConfig.Config> = {
	ts: baseConfig,
	"vue/ts": vueConfig,
};

export function createEslintConfig(params: CreateEslintConfigParams) {
	const currentConfig = environmentMapper[params.environment];
	const currentRules = {
		...(
			params.ruleset?.base !== false
				? baseRules
				: {}
		),
		...(
			params.ruleset?.open === true
				? openRules
				: {}
		),
		...(
			params.ruleset?.test === true
				? testRules
				: {}
		),
		...(
			(
				params.environment === "vue/ts"
				&& params.ruleset?.vue !== false
			)
				? vueRules
				: {}
		),
		...params.customRules,
	};

	return {
		...currentConfig,
		files: params.files,
		rules: currentRules,
	} satisfies FlatConfig.Config;
}
