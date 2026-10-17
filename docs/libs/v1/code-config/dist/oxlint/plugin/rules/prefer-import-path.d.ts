import { Rule } from 'eslint';
export interface PreferredImportPath {
    replacement: string;
    exceptions?: readonly string[];
}
export interface PreferImportPathOptions {
    paths: Readonly<Record<string, PreferredImportPath>>;
}
export type PreferImportPathRuleOptions = readonly [PreferImportPathOptions];
export declare const preferImportPath: Rule.RuleModule;
