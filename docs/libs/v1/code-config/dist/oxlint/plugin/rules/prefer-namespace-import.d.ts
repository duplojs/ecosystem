import { Rule } from 'eslint';
export interface PreferNamespaceImportOptions {
    paths: Readonly<Record<string, string>>;
}
export type PreferNamespaceImportRuleOptions = readonly [
    PreferNamespaceImportOptions
];
export declare const preferNamespaceImport: Rule.RuleModule;
