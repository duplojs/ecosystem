import { builtinRules } from "eslint/use-at-your-own-risk";

export interface CamelcaseOptions {
	allow?: readonly string[];
	ignoreDestructuring?: boolean;
	ignoreGlobals?: boolean;
	ignoreImports?: boolean;
	properties?: "always" | "never";
}

export type CamelcaseRuleOptions =
	| readonly []
	| readonly [CamelcaseOptions];

export const camelcase = builtinRules.get("camelcase")!;
