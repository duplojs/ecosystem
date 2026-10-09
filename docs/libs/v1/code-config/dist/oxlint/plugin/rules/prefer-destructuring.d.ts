export interface DestructuringTargets {
    array?: boolean;
    object?: boolean;
}
export interface DestructuringNodeTargets {
    VariableDeclarator?: DestructuringTargets;
    AssignmentExpression?: DestructuringTargets;
}
export type PreferDestructuringOptions = DestructuringTargets | DestructuringNodeTargets;
export interface PreferDestructuringAdditionalOptions {
    enforceForRenamedProperties?: boolean;
}
export type PreferDestructuringRuleOptions = readonly [] | readonly [PreferDestructuringOptions] | readonly [
    PreferDestructuringOptions,
    PreferDestructuringAdditionalOptions
];
export declare const preferDestructuring: import("eslint").Rule.RuleModule;
