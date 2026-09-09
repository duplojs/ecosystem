import { builtinRules } from "eslint/use-at-your-own-risk";

export type LoopStatementType =
	| "WhileStatement"
	| "DoWhileStatement"
	| "ForStatement"
	| "ForInStatement"
	| "ForOfStatement";

export interface NoUnreachableLoopOptions {
	ignore?: readonly LoopStatementType[];
}

export type NoUnreachableLoopRuleOptions =
	| readonly []
	| readonly [NoUnreachableLoopOptions];

export const noUnreachableLoop = builtinRules.get("no-unreachable-loop")!;
