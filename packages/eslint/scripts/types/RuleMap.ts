import type { Linter } from "eslint";
import type { ESLintRules } from "eslint/rules";
import type { RuleOptions as StylisticRuleOptions } from "@stylistic/eslint-plugin";
import type { RuleOptions as VueRuleOptions } from "eslint-plugin-vue/dist/eslint-typegen";

export type RuleConfig<
	GenericOptions extends readonly unknown[],
> = (
	| Linter.RuleSeverity
	| readonly [Linter.RuleSeverity]
	| readonly [Linter.RuleSeverity, ...Partial<GenericOptions>]
);

export type RuleEntryToReadonlyConfig<
	GenericRule extends unknown,
> = GenericRule extends Linter.RuleEntry<infer InferredOptions>
	? RuleConfig<Readonly<InferredOptions>>
	: RuleConfig<readonly unknown[]>;

export type ESLintRuleMap = {
	[RuleName in keyof ESLintRules]?: RuleEntryToReadonlyConfig<ESLintRules[RuleName]>;
};

export type TypeScriptESLintRuleMap = {
	[RuleName in `@typescript-eslint/${string}`]?: RuleConfig<readonly unknown[]>;
};

export type VueRuleMap = {
	[RuleName in keyof VueRuleOptions]?: RuleEntryToReadonlyConfig<NonNullable<VueRuleOptions[RuleName]>>;
};

type StylisticRuleMap = {
	[RuleName in keyof StylisticRuleOptions]?: RuleConfig<StylisticRuleOptions[RuleName]>;
};

export type RuleMap = (
	& ESLintRuleMap
	& StylisticRuleMap
	& VueRuleMap
	& TypeScriptESLintRuleMap
);
