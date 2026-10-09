import * as DModeling from "@duplojs-v1/lang/modeling";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface OptionIssueBase {
    readonly data: unknown;
    readonly path: string;
    readonly optionName: string;
}
export interface RequiredOptionIssue extends OptionIssueBase, DModeling.ObjectTag<"RequiredOptionIssue"> {
}
export interface RequiredOptionValueIssue extends OptionIssueBase, DModeling.ObjectTag<"RequiredOptionValueIssue"> {
}
export interface UnexpectedOptionValueIssue extends OptionIssueBase, DModeling.ObjectTag<"UnexpectedOptionValueIssue"> {
}
export interface DataStructureOptionIssue extends OptionIssueBase, DModeling.ObjectTag<"DataStructureOptionIssue"> {
    readonly dataStructureError: DDataStructure.Error;
}
export interface ArgumentIssueBase {
    readonly data: unknown;
    readonly path: string;
    readonly argumentName: string;
}
export interface RequiredArgumentIssue extends ArgumentIssueBase, DModeling.ObjectTag<"RequiredArgumentIssue"> {
}
export interface DataStructureArgumentIssue extends ArgumentIssueBase, DModeling.ObjectTag<"DataStructureArgumentIssue"> {
    readonly dataStructureError: DDataStructure.Error;
}
export interface CommandArgumentIssueBase {
    readonly path: string;
}
export interface TooMuchCommandArgumentIssue extends CommandArgumentIssueBase, DModeling.ObjectTag<"TooMuchCommandArgumentIssue"> {
    readonly expect: number;
    readonly receive: number;
}
export type Issues = (RequiredOptionIssue | RequiredOptionValueIssue | UnexpectedOptionValueIssue | DataStructureOptionIssue | RequiredArgumentIssue | DataStructureArgumentIssue | TooMuchCommandArgumentIssue);
export declare const SymbolCommandError: unique symbol;
export type SymbolCommandError = typeof SymbolCommandError;
export interface Error {
    readonly issues: readonly Issues[];
    readonly currentPath: readonly string[];
    pushPath(path: string): void;
    addRequiredOptionIssue(optionName: string): SymbolCommandError;
    addRequiredOptionValueIssue(optionName: string): SymbolCommandError;
    addUnexpectedOptionValueIssue(optionName: string, data: unknown): SymbolCommandError;
    addDataStructureOptionIssue(optionName: string, data: unknown, dataStructureError: DDataStructure.Error): SymbolCommandError;
    addRequiredArgumentIssue(argumentName: string): SymbolCommandError;
    addDataStructureArgumentIssue(argumentName: string, data: unknown, dataStructureError: DDataStructure.Error): SymbolCommandError;
    addTooMuchCommandArgumentIssue(expect: number, receive: number): SymbolCommandError;
}
export declare function createError(commandName: string): Error;
export declare function interpretDataStructureError(error: DDataStructure.Error, dataStructureErrorInterpreter: DDataStructure.ErrorInterpreter): readonly string[];
export declare function interpretErrorIssues(issues: readonly Issues[], dataStructureErrorInterpreter: DDataStructure.ErrorInterpreter): string;
export declare function interpretExecCommandError(error: Error, dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter): string;
export declare function interpretExecOptionsError(error: Error, dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter): string;
