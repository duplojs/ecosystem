import type * as DCommon from "@scripts/common";
import { isResult, result, type PatternResult } from "./result";

type IsPredicateOutputCompatible<
	GenericInput extends unknown,
	GenericPredicatedInput extends GenericInput,
	GenericPredicate extends unknown,
> = DCommon.IsEqual<GenericPredicatedInput, any> extends true
	? never
	: DCommon.IsUnion<GenericPredicate> extends true
		? never
		: unknown;

type ComputeCallbackInput<
	GenericInput extends unknown,
	GenericPredicate extends unknown,
	GenericPredicatedInput extends GenericInput,
> = GenericPredicate extends (input: GenericInput) => input is GenericPredicatedInput
	? DCommon.IsEqual<DCommon.Predicate<GenericPredicate>, any> extends true
		? GenericInput
		: Exclude<GenericInput, GenericPredicatedInput>
	: GenericInput;

export function whenNot<
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
	GenericPredicate extends unknown = (
		input: DCommon.BreakGenericLink<GenericInputValue>,
	) => input is GenericPredicatedInput,
>(
	predicate: (
		& ((input: DCommon.BreakGenericLink<GenericInputValue>) => input is GenericPredicatedInput)
		& DCommon.FixDeepFunctionInfer<
			(input: DCommon.BreakGenericLink<GenericInputValue>) => input is GenericPredicatedInput,
			GenericPredicate
		>
		& IsPredicateOutputCompatible<GenericInputValue, GenericPredicatedInput, GenericPredicate>
	),
	theFunction: (predicatedInput: ComputeCallbackInput<
		GenericInputValue,
		GenericPredicate,
		GenericPredicatedInput
	>) => GenericOutput,
): (
	input: (
		| GenericInput
		| GenericInputPatternResult
		| GenericInputValue
	),
) => (
	| GenericInputPatternResult
	| GenericPredicatedInput
	| PatternResult<GenericOutput>
);

export function whenNot<
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
		input: DCommon.BreakGenericLink<GenericInputValue>,
	) => boolean,
	theFunction: (predicatedInput: DCommon.BreakGenericLink<GenericInputValue>) => GenericOutput,
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

export function whenNot<
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
	GenericPredicate extends unknown = (
		input: DCommon.BreakGenericLink<GenericInputValue>,
	) => input is GenericPredicatedInput,
>(
	input: (
		| GenericInput
		| GenericInputPatternResult
		| GenericInputValue
	),
	predicate: (
		& ((input: DCommon.BreakGenericLink<GenericInputValue>) => input is GenericPredicatedInput)
		& DCommon.FixDeepFunctionInfer<
			(input: DCommon.BreakGenericLink<GenericInputValue>) => input is GenericPredicatedInput,
			GenericPredicate
		>
		& IsPredicateOutputCompatible<GenericInputValue, GenericPredicatedInput, GenericPredicate>
	),
	theFunction: (predicatedInput: ComputeCallbackInput<
		GenericInputValue,
		GenericPredicate,
		GenericPredicatedInput
	>) => GenericOutput,
): (
	| GenericInputPatternResult
	| GenericPredicatedInput
	| PatternResult<GenericOutput>
);

export function whenNot<
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
		input: DCommon.BreakGenericLink<GenericInputValue>,
	) => boolean,
	theFunction: (predicatedInput: DCommon.BreakGenericLink<GenericInputValue>) => GenericOutput,
): (
	| GenericInputPatternResult
	| GenericInputValue
	| PatternResult<GenericOutput>
);

export function whenNot(
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

		return (input: unknown) => whenNot(input, predicate as never, theFunction);
	}

	const [input, predicate, theFunction] = args;

	if (!isResult(input) && !predicate(input)) {
		return result(theFunction(input));
	}

	return input;
}
