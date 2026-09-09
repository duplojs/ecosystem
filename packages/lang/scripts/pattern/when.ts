import type * as DCommon from "@scripts/common";
import { isResult, result, type PatternResult } from "./result";

type ComputePredicateInput<GenericValue extends unknown> = Exclude<
	DCommon.IsEqual<GenericValue, unknown> extends true
		? DCommon.AnyValue
		: GenericValue,
	PatternResult
>;

export function when<
	GenericInput extends unknown,
	GenericInputValue extends ComputePredicateInput<GenericInput>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	GenericPredicatedInput extends GenericInputValue,
	GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	predicate: (
		& ((input: GenericInputValue) => input is GenericPredicatedInput)
		& (
			DCommon.IsEqual<ComputePredicateInput<GenericInput>, GenericInputValue> extends true
				? unknown
				: (input: ComputePredicateInput<NoInfer<GenericInput>>) => input is GenericPredicatedInput
		)
	),
	theFunction: (predicatedInput: GenericPredicatedInput) => GenericOutput,
): (
	input: (
		| GenericInput
		| GenericInputPatternResult
		| GenericInputValue
	),
) => (
	| GenericInputPatternResult
	| Exclude<DCommon.BreakGenericLink<GenericInput>, GenericPredicatedInput | PatternResult>
	| PatternResult<GenericOutput>
);

export function when<
	GenericInput extends unknown,
	GenericInputValue extends Exclude<
		DCommon.IsEqual<GenericInput, unknown> extends true
			? DCommon.AnyValue
			: GenericInput,
		PatternResult
	>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	predicate: (
		& ((input: GenericInputValue) => boolean)
		& (
			DCommon.IsEqual<ComputePredicateInput<GenericInput>, GenericInputValue> extends true
				? unknown
				: (input: ComputePredicateInput<NoInfer<GenericInput>>) => boolean
		)
	),
	theFunction: (predicatedInput: GenericInputValue) => GenericOutput,
): (
	input: (
		| GenericInput
		| GenericInputPatternResult
		| GenericInputValue
	),
) => (
	| GenericInputPatternResult
	| GenericInputValue
	| PatternResult<GenericOutput>
);

export function when<
	GenericInput extends unknown,
	GenericInputValue extends Exclude<
		DCommon.IsEqual<GenericInput, unknown> extends true
			? DCommon.AnyValue
			: GenericInput,
		PatternResult
	>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	GenericPredicatedInput extends GenericInputValue,
	GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	input: (
		| GenericInput
		| GenericInputPatternResult
		| GenericInputValue
	),
	predicate: (
		input: GenericInputValue,
	) => input is GenericPredicatedInput,
	theFunction: (predicatedInput: GenericPredicatedInput) => GenericOutput,
): (
	| GenericInputPatternResult
	| Exclude<DCommon.BreakGenericLink<GenericInput>, GenericPredicatedInput | PatternResult>
	| PatternResult<GenericOutput>
);

export function when<
	GenericInput extends unknown,
	GenericInputValue extends Exclude<
		DCommon.IsEqual<GenericInput, unknown> extends true
			? DCommon.AnyValue
			: GenericInput,
		PatternResult
	>,
	GenericInputPatternResult extends Extract<GenericInput, PatternResult>,
	GenericOutput extends DCommon.AnyValue | DCommon.EscapeVoid,
>(
	input: (
		| GenericInput
		| GenericInputPatternResult
		| GenericInputValue
	),
	predicate: (
		input: GenericInputValue,
	) => boolean,
	theFunction: (predicatedInput: GenericInputValue) => GenericOutput,
): (
	| GenericInputPatternResult
	| GenericInputValue
	| PatternResult<GenericOutput>
);

export function when(
	...args:
		| [predicate: DCommon.AnyFunction, theFunction: DCommon.AnyFunction]
		| [
			input: unknown,
			predicate: DCommon.AnyFunction,
			theFunction: DCommon.AnyFunction,
		]
) {
	if (args.length === 2) {
		const [predicate, theFunction] = args;

		return (input: unknown) => when(input, predicate as never, theFunction);
	}

	const [input, predicate, theFunction] = args;

	if (!isResult(input) && predicate(input)) {
		return result(theFunction(input));
	}

	return input;
}
