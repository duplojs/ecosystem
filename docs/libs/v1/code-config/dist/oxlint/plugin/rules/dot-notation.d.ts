export interface DotNotationOptions {
    allowKeywords?: boolean;
    allowPattern?: string;
}
export type DotNotationRuleOptions = readonly [] | readonly [DotNotationOptions];
export declare const dotNotation: import("eslint").Rule.RuleModule;
