import { CamelcaseRuleOptions, DotNotationRuleOptions, NoUnreachableLoopRuleOptions, PreferDestructuringRuleOptions, PreferNamespaceImportRuleOptions, PreferImportPathRuleOptions, PreferNamespaceFromBarrelRuleOptions } from '../rules';
export interface PluginRuleOptions {
    "duplojs-plugin/camelcase": CamelcaseRuleOptions;
    "duplojs-plugin/dot-notation": DotNotationRuleOptions;
    "duplojs-plugin/no-unreachable-loop": NoUnreachableLoopRuleOptions;
    "duplojs-plugin/prefer-destructuring": PreferDestructuringRuleOptions;
    "duplojs-plugin/prefer-namespace-import": PreferNamespaceImportRuleOptions;
    "duplojs-plugin/prefer-import-path": PreferImportPathRuleOptions;
    "duplojs-plugin/prefer-namespace-from-barrel": PreferNamespaceFromBarrelRuleOptions;
}
