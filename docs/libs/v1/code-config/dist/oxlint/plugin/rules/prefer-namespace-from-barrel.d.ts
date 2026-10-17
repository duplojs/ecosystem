import { Rule } from 'eslint';
export interface PreferNamespaceFromBarrelOptions {
    sources: readonly string[];
    namespaces: Readonly<Record<string, string>>;
}
export type PreferNamespaceFromBarrelRuleOptions = readonly [
    PreferNamespaceFromBarrelOptions
];
export declare const preferNamespaceFromBarrel: Rule.RuleModule;
