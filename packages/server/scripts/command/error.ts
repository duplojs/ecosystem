import * as DCommon from "@duplojs/lang/common";
import * as DPrinter from "@duplojs/lang/printer";
import * as DString from "@duplojs/lang/string";
import * as DModeling from "@duplojs/lang/modeling";
import * as DArray from "@duplojs/lang/array";
import * as DPattern from "@duplojs/lang/pattern";
import * as DDataStructure from "@duplojs/lang/dataStructure";
import * as DSDataStructure from "@scripts/dataStructure";

export interface OptionIssueBase {
	readonly data: unknown;
	readonly path: string;
	readonly optionName: string;
}

export interface RequiredOptionIssue extends OptionIssueBase,
	DModeling.ObjectTag<"RequiredOptionIssue"> {}

export interface RequiredOptionValueIssue extends OptionIssueBase,
	DModeling.ObjectTag<"RequiredOptionValueIssue"> {}

export interface UnexpectedOptionValueIssue extends OptionIssueBase,
	DModeling.ObjectTag<"UnexpectedOptionValueIssue"> {}

export interface DataStructureOptionIssue extends OptionIssueBase,
	DModeling.ObjectTag<"DataStructureOptionIssue"> {
	readonly dataStructureError: DDataStructure.Error;
}

export interface ArgumentIssueBase {
	readonly data: unknown;
	readonly path: string;
	readonly argumentName: string;
}

export interface RequiredArgumentIssue extends ArgumentIssueBase,
	DModeling.ObjectTag<"RequiredArgumentIssue"> {}

export interface DataStructureArgumentIssue extends ArgumentIssueBase,
	DModeling.ObjectTag<"DataStructureArgumentIssue"> {
	readonly dataStructureError: DDataStructure.Error;
}

export interface CommandArgumentIssueBase {
	readonly path: string;
}

export interface UnknownOptionIssue extends CommandArgumentIssueBase,
	DModeling.ObjectTag<"UnknownOptionIssue"> {
	readonly optionTokens: readonly string[];
}

export interface UnknownSubCommandIssue extends CommandArgumentIssueBase,
	DModeling.ObjectTag<"UnknownSubCommandIssue"> {
	readonly subCommandName: string;
}

export interface TooMuchCommandArgumentIssue extends CommandArgumentIssueBase,
	DModeling.ObjectTag<"TooMuchCommandArgumentIssue"> {
	readonly expect: number;
	readonly receive: number;
}

export type Issues = (
	| RequiredOptionIssue
	| RequiredOptionValueIssue
	| UnexpectedOptionValueIssue
	| DataStructureOptionIssue
	| RequiredArgumentIssue
	| DataStructureArgumentIssue
	| TooMuchCommandArgumentIssue
	| UnknownOptionIssue
	| UnknownSubCommandIssue
);

export const SymbolCommandError = Symbol.for("SymbolCommandError");
export type SymbolCommandError = typeof SymbolCommandError;

export interface Error {
	readonly issues: readonly Issues[];
	readonly currentPath: readonly string[];
	pushPath(path: string): void;
	addUnknownOptionIssue(
		optionTokens: readonly string[],
	): SymbolCommandError;
	addUnknownSubCommandIssue(
		subCommandName: string,
	): SymbolCommandError;
	addRequiredOptionIssue(
		optionName: string,
	): SymbolCommandError;
	addRequiredOptionValueIssue(
		optionName: string,
	): SymbolCommandError;
	addUnexpectedOptionValueIssue(
		optionName: string,
		data: unknown,
	): SymbolCommandError;
	addDataStructureOptionIssue(
		optionName: string,
		data: unknown,
		dataStructureError: DDataStructure.Error,
	): SymbolCommandError;
	addRequiredArgumentIssue(
		argumentName: string,
	): SymbolCommandError;
	addDataStructureArgumentIssue(
		argumentName: string,
		data: unknown,
		dataStructureError: DDataStructure.Error,
	): SymbolCommandError;
	addTooMuchCommandArgumentIssue(
		expect: number,
		receive: number,
	): SymbolCommandError;
}

export function createError(
	commandName: string,
): Error {
	const issues: Issues[] = [];
	const currentPath = [commandName];

	return {
		issues,
		currentPath,
		pushPath: (path) => void currentPath.push(path),
		addUnknownOptionIssue: (
			optionTokens,
		) => {
			issues.push(
				DModeling.taggedObject(
					"UnknownOptionIssue",
					{
						optionTokens,
						path: DString.join(currentPath, "."),
					},
				),
			);

			return SymbolCommandError;
		},
		addUnknownSubCommandIssue: (
			subCommandName,
		) => {
			issues.push(
				DModeling.taggedObject(
					"UnknownSubCommandIssue",
					{
						subCommandName,
						path: DString.join(currentPath, "."),
					},
				),
			);

			return SymbolCommandError;
		},
		addRequiredOptionIssue: (
			optionName,
		) => {
			issues.push(
				DModeling.taggedObject(
					"RequiredOptionIssue",
					{
						optionName,
						data: undefined,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
		addRequiredOptionValueIssue: (
			optionName,
		) => {
			issues.push(
				DModeling.taggedObject(
					"RequiredOptionValueIssue",
					{
						optionName,
						data: undefined,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
		addUnexpectedOptionValueIssue: (
			optionName,
			data,
		) => {
			issues.push(
				DModeling.taggedObject(
					"UnexpectedOptionValueIssue",
					{
						optionName,
						data,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
		addDataStructureOptionIssue: (
			optionName,
			data,
			dataStructureError,
		) => {
			issues.push(
				DModeling.taggedObject(
					"DataStructureOptionIssue",
					{
						optionName,
						data,
						dataStructureError,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
		addRequiredArgumentIssue: (
			argumentName,
		) => {
			issues.push(
				DModeling.taggedObject(
					"RequiredArgumentIssue",
					{
						argumentName,
						data: undefined,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
		addDataStructureArgumentIssue: (
			argumentName,
			data,
			dataStructureError,
		) => {
			issues.push(
				DModeling.taggedObject(
					"DataStructureArgumentIssue",
					{
						argumentName,
						data,
						dataStructureError,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
		addTooMuchCommandArgumentIssue: (
			expect,
			receive,
		) => {
			issues.push(
				DModeling.taggedObject(
					"TooMuchCommandArgumentIssue",
					{
						expect,
						receive,
						path: currentPath.join("."),
					},
				),
			);

			return SymbolCommandError;
		},
	};
}

export function interpretDataStructureError(
	error: DDataStructure.Error,
	dataStructureErrorInterpreter: DDataStructure.ErrorInterpreter,
) {
	return DCommon.pipe(
		dataStructureErrorInterpreter(error),
		DArray.map(
			({ interpretedMessage, path }) => DPrinter.renderLine(
				[
					"↳ ",
					DPrinter.colorizedBold(path || "<value>", "cyan"),
					" : ",
					DPrinter.colorizedBold(
						interpretedMessage.subSource
							?? interpretedMessage.interpretedSubSource
							?? interpretedMessage.source
							?? interpretedMessage.interpretedSource
							?? "unknown data structure error.",
						"red",
					),
				],
				{
					joinCharacter: "",
					indent: DPrinter.Indent.tab,
					indentLevel: 1,
				},
			),
		),
	);
}

export function interpretErrorIssues(
	issues: readonly Issues[],
	dataStructureErrorInterpreter: DDataStructure.ErrorInterpreter,
) {
	return DPrinter.renderParagraph(
		[
			DArray.map(
				issues,
				DPattern.matchWithTaggedObject({
					UnknownOptionIssue: ({ optionTokens }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("OPTION: ", "blue"),
								DString.join(optionTokens, ", "),
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						DPrinter.renderLine(["↳ Unknown Option"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
					UnknownSubCommandIssue: ({ subCommandName }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("SUB-COMMAND: ", "cyan"),
								subCommandName,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						DPrinter.renderLine(["↳ Unknown Sub-command"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
					DataStructureArgumentIssue: ({ argumentName, dataStructureError }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("ARGUMENT: ", "magenta"),
								`--${argumentName}`,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						interpretDataStructureError(dataStructureError, dataStructureErrorInterpreter),
					],
					RequiredArgumentIssue: ({ argumentName }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("ARGUMENT: ", "magenta"),
								argumentName,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						DPrinter.renderLine(["↳ Missing Argument"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
					DataStructureOptionIssue: ({ optionName, dataStructureError }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("OPTION: ", "blue"),
								`--${optionName}`,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						interpretDataStructureError(dataStructureError, dataStructureErrorInterpreter),
					],
					RequiredOptionIssue: ({ optionName }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("OPTION: ", "blue"),
								`--${optionName}`,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						DPrinter.renderLine(["↳ Missing Option"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
					RequiredOptionValueIssue: ({ optionName }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("OPTION: ", "blue"),
								`--${optionName}`,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						DPrinter.renderLine(["↳ Missing Option Value"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
					UnexpectedOptionValueIssue: ({ optionName }) => [
						DPrinter.renderLine(
							[
								DPrinter.colorizedBold("OPTION: ", "blue"),
								`--${optionName}`,
							],
							{
								joinCharacter: "",
								indent: DPrinter.Indent.tab,
								indentLevel: 1,
							},
						),
						DPrinter.renderLine(["↳ Unexpected Value At This Option"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
					TooMuchCommandArgumentIssue: ({ expect, receive }) => [
						DPrinter.renderLine([" Too Much Arguments"], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
						DPrinter.renderLine([` expect: ${expect} receive: ${receive}`], {
							indent: DPrinter.Indent.tab,
							indentLevel: 1,
						}),
					],
				}),
			),
			issues.length === 0 && "No issue found",
		],
	);
}

const defaultDataStructureErrorInterpreter = DDataStructure.createErrorInterpreter(
	DSDataStructure.defaultErrorInterpreterDataStructureDictionary,
	DSDataStructure.defaultErrorInterpreterCodecDictionary,
);

export function interpretExecCommandError(
	error: Error,
	dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter,
): string {
	return DPrinter.renderParagraph(
		[
			DPrinter.colorizedBold("Command failed", "red"),
			DPrinter.renderLine(
				[
					DPrinter.colorizedBold("COMMAND: ", "cyan"),
					DString.join(error.currentPath, " "),
				],
				{
					joinCharacter: "",
					indent: DPrinter.Indent.tab,
					indentLevel: 1,
				},
			),
			interpretErrorIssues(error.issues, dataStructureErrorInterpreter ?? defaultDataStructureErrorInterpreter),
		],
	);
}

export function interpretExecOptionsError(
	error: Error,
	dataStructureErrorInterpreter?: DDataStructure.ErrorInterpreter,
): string {
	return DPrinter.renderParagraph(
		[
			DPrinter.colorizedBold("Invalid options", "red"),
			["", ""],
			interpretErrorIssues(error.issues, dataStructureErrorInterpreter ?? defaultDataStructureErrorInterpreter),
		],
	);
}
