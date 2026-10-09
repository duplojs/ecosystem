export interface CamelcaseOptions {
    allow?: readonly string[];
    ignoreDestructuring?: boolean;
    ignoreGlobals?: boolean;
    ignoreImports?: boolean;
    properties?: "always" | "never";
}
export type CamelcaseRuleOptions = readonly [] | readonly [CamelcaseOptions];
export declare const camelcase: import("eslint").Rule.RuleModule;
