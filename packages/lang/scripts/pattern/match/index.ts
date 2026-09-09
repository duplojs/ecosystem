import type * as DCommon from "@scripts/common";
import { type PatternValue, type Pattern } from "../types/pattern";
import { isResult, type PatternResult, result } from "../result";
import { type ComplexMatchedValue, type ComplexUnMatchedValue } from "../types";
import { isMatch } from "../isMatch";
import { type MatchBuilder, matchBuilder } from "./builder";

export * from "./builder";

export function match<
	GenericInput extends unknown,
>(
	input: GenericInput,
): MatchBuilder<
	DCommon.IsEqual<GenericInput, unknown> extends true
		? DCommon.AnyValue
		: GenericInput
>;

export function match<
	GenericInput extends unknown,
	GenericInputValue extends Exclude<
		DCommon.IsEqual<GenericInput, unknown> extends true
			? DCommon.AnyValue
			: GenericInput,
		PatternResult
	>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	const GenericPattern extends Pattern<GenericInputValue>,
	GenericPatternValue extends PatternValue<GenericPattern>,
	GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
	GenericMatchedValue extends Extract<
		ComplexMatchedValue<
			GenericInputValue,
			GenericPatternValue
		>,
		any
	>,
>(
	pattern: DCommon.FixDeepFunctionInfer<
		Pattern<GenericInputValue>,
		GenericPattern
	>,
	theFunction: (
		value: Extract<
			ComplexMatchedValue<
				GenericInputValue,
				PatternValue<GenericPattern>
			>,
			any
		>,
	) => GenericOutput,
): (input: GenericInput | GenericInputValue | GenericInputPatternResult) => DCommon.BreakGenericLink<(
	| (
		DCommon.IsEqual<GenericMatchedValue, never> extends true
			? never
			: PatternResult<GenericOutput>
	)
	| GenericInputPatternResult
	| Extract<
		ComplexUnMatchedValue<
			GenericInputValue,
			GenericPatternValue
		>,
		any
	>
)>;

export function match<
	GenericInput extends unknown,
	GenericInputValue extends Exclude<
		DCommon.IsEqual<GenericInput, unknown> extends true
			? DCommon.AnyValue
			: GenericInput,
		PatternResult
	>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	const GenericPattern extends Pattern<GenericInputValue>,
	GenericPatternValue extends PatternValue<GenericPattern>,
	GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
	GenericMatchedValue extends Extract<
		ComplexMatchedValue<
			GenericInputValue,
			GenericPatternValue
		>,
		any
	>,
>(
	input: GenericInput | GenericInputValue | GenericInputPatternResult,
	pattern: DCommon.FixDeepFunctionInfer<
		Pattern<GenericInputValue>,
		GenericPattern
	>,
	theFunction: (
		value: Extract<
			ComplexMatchedValue<
				GenericInputValue,
				PatternValue<GenericPattern>
			>,
			any
		>,
	) => GenericOutput,
): DCommon.BreakGenericLink<
	| (
		DCommon.IsEqual<GenericMatchedValue, never> extends true
			? never
			: PatternResult<GenericOutput>
	)
	| GenericInputPatternResult
	| Extract<
		ComplexUnMatchedValue<
			GenericInputValue,
			GenericPatternValue
		>,
		any
	>
>;

export function match(
	...args: [unknown, Pattern, DCommon.AnyFunction] | [Pattern, DCommon.AnyFunction] | [unknown]
) {
	if (args.length === 1) {
		const [input] = args;

		return matchBuilder.use({
			input,
			matchers: [],
		});
	}

	if (args.length === 2) {
		const [pattern, theFunction] = args;

		return (input: unknown) => match(input, pattern, theFunction);
	}

	const [input, pattern, theFunction] = args;

	if (!isResult(input) && isMatch(input as never, pattern)) {
		return result(
			theFunction(
				input,
			),
		);
	}

	return input;
}
