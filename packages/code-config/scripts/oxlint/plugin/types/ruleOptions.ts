import type { CamelcaseRuleOptions, DotNotationRuleOptions, NoUnreachableLoopRuleOptions, PreferDestructuringRuleOptions, PreferNamespaceImportRuleOptions } from "../rules";
import { type NoRestrictedImportRuleOptions } from "../rules/no-restricted-import";

export interface PluginRuleOptions {
	"duplojs-plugin/camelcase": CamelcaseRuleOptions;
	"duplojs-plugin/dot-notation": DotNotationRuleOptions;
	"duplojs-plugin/no-unreachable-loop": NoUnreachableLoopRuleOptions;
	"duplojs-plugin/prefer-destructuring": PreferDestructuringRuleOptions;
	"duplojs-plugin/prefer-namespace-import": PreferNamespaceImportRuleOptions;
	"duplojs-plugin/no-restricted-import": NoRestrictedImportRuleOptions;
}
