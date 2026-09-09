import type { CamelcaseRuleOptions, DotNotationRuleOptions, NoUnreachableLoopRuleOptions, PreferDestructuringRuleOptions } from "../rules";

export interface PluginRuleOptions {
	"duplojs-plugin/camelcase": CamelcaseRuleOptions;
	"duplojs-plugin/dot-notation": DotNotationRuleOptions;
	"duplojs-plugin/no-unreachable-loop": NoUnreachableLoopRuleOptions;
	"duplojs-plugin/prefer-destructuring": PreferDestructuringRuleOptions;
}
