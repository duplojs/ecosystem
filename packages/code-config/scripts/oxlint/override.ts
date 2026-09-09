import type { RuleOptions } from "@stylistic/eslint-plugin";
import type { PluginRuleOptions } from "./plugin/types";

export type RuleSeverity = ("allow" | "off" | "warn" | "error" | "deny") | number;

export type RuleConfig<
	GenericOptions extends readonly unknown[],
> = (
	| RuleSeverity
	| [RuleSeverity]
	| [RuleSeverity, ...GenericOptions]
);

export type RulesConfigMap<
	GenericRules extends {
		[RuleName in keyof GenericRules]: readonly unknown[];
	},
> = {
	[RuleName in keyof GenericRules]?: RuleConfig<GenericRules[RuleName]>;
};

type ExtraRuleMap = (
	& RulesConfigMap<RuleOptions>
	& RulesConfigMap<PluginRuleOptions>
);

declare module "oxlint" {
	interface DummyRuleMap extends ExtraRuleMap {}
}
