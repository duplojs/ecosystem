import { builtinRules } from "eslint/use-at-your-own-risk";

export interface DotNotationOptions {
	allowKeywords?: boolean;
	allowPattern?: string;
}

export type DotNotationRuleOptions =
	| readonly []
	| readonly [DotNotationOptions];

export const dotNotation = builtinRules.get("dot-notation")!;
