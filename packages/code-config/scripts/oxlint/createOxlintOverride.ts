import type { OxlintOverride } from "oxlint";
import type { OxlintRules } from "./defineRules";
import { baseRules } from "./base";
import { openRules } from "./open";
import { testRules } from "./test";

export interface OxlintRuleset {
	base?: boolean;
	open?: boolean;
	test?: boolean;
}

export interface CreateOxlintOverrideParams extends Omit<OxlintOverride, "rules"> {
	ruleset?: OxlintRuleset;
	customRules?: OxlintRules;
}

export function createOxlintOverride(params: CreateOxlintOverrideParams): OxlintOverride {
	const { ruleset, customRules, ...override } = params;

	return {
		...override,
		rules: {
			...(ruleset?.base !== false ? baseRules : {}),
			...(ruleset?.open === true ? openRules : {}),
			...(ruleset?.test === true ? testRules : {}),
			...customRules,
		},
	};
}
