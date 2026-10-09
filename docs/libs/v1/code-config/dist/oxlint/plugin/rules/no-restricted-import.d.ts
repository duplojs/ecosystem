import { Rule } from 'eslint';
export interface NoRestrictedImportOptions {
    paths: Readonly<Record<string, string | null>>;
}
export type NoRestrictedImportRuleOptions = readonly [
    NoRestrictedImportOptions
];
export declare const noRestrictedImport: Rule.RuleModule;
