/* eslint-disable @typescript-eslint/no-for-in-array */
import type * as DCommon from "@scripts/common";
import { SymbolToolPatternFunctionLabel, type ComplexMatchedValue, type Pattern, type PatternValue, type ToolPattern } from "./types";

const SymbolToolPatternFunction = Symbol.for(SymbolToolPatternFunctionLabel);

export function isMatch<
	GenericInput extends DCommon.AnyValue,
	const GenericPattern extends Pattern<GenericInput>,
>(
	pattern: DCommon.FixDeepFunctionInfer<
		Pattern<GenericInput>,
		GenericPattern
	>,
): (
	input: GenericInput,
) => input is DCommon.ForcePredicate<
	GenericInput,
	ComplexMatchedValue<
		GenericInput,
		PatternValue<GenericPattern>
	>
>;

export function isMatch<
	GenericInput extends DCommon.AnyValue,
	const GenericPattern extends Pattern<GenericInput>,
>(
	input: GenericInput,
	pattern: DCommon.FixDeepFunctionInfer<
		Pattern<GenericInput>,
		GenericPattern
	>,
): input is DCommon.ForcePredicate<
	GenericInput,
	ComplexMatchedValue<
		GenericInput,
		PatternValue<GenericPattern>
	>
>;

export function isMatch(
	...args:
		| [pattern: Pattern]
		| [input: unknown, pattern: Pattern]
) {
	if (args.length === 1) {
		const [pattern] = args;

		return (input: DCommon.AnyValue) => isMatch(input, pattern);
	}

	const [input, pattern] = args;

	if (
		typeof pattern === "string"
		|| typeof pattern === "number"
		|| typeof pattern === "boolean"
		|| typeof pattern === "bigint"
		|| pattern === null
		|| pattern === undefined
	) {
		return input === pattern;
	} else if (
		typeof pattern === "function"
	) {
		return (pattern as DCommon.AnyFunction)(input);
	} else if (pattern instanceof Array && input instanceof Array) {
		for (const key in pattern) {
			if (
				!isMatch(
					input[key as never],
					(pattern as object)[key as never],
				)
			) {
				return false;
			}
		}

		return true;
	} else if (
		pattern
		&& typeof pattern === "object"
		&& SymbolToolPatternFunction in pattern
	) {
		return ((pattern as ToolPattern)[SymbolToolPatternFunction as never] as DCommon.AnyFunction)(input);
	} else if (
		pattern
		&& typeof pattern === "object"
		&& input && typeof input === "object"
	) {
		for (const key in pattern) {
			if (
				!isMatch(
					input[key as never],
					(pattern as object)[key as never],
				)
			) {
				return false;
			}
		}

		return true;
	}

	return false;
}
