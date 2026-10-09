export type LoopStatementType = "WhileStatement" | "DoWhileStatement" | "ForStatement" | "ForInStatement" | "ForOfStatement";
export interface NoUnreachableLoopOptions {
    ignore?: readonly LoopStatementType[];
}
export type NoUnreachableLoopRuleOptions = readonly [] | readonly [NoUnreachableLoopOptions];
export declare const noUnreachableLoop: import("eslint").Rule.RuleModule;
