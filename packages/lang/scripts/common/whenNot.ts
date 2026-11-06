import type { EscapeVoid, AnyFunction, AnyValue, BreakGenericLink, FixDeepFunctionInfer, IsEqual, IsUnion, Predicate } from "./types";

type IsPredicateOutputCompatible<
	GenericInput extends AnyValue,
	GenericPredicatedInput extends GenericInput,
	GenericPredicate extends unknown,
> = IsEqual<GenericPredicatedInput, any> extends true
	? never
	: IsUnion<GenericPredicate> extends true
		? never
		: unknown;

type ComputeCallbackInput<
	GenericInput extends AnyValue,
	GenericPredicate extends unknown,
	GenericPredicatedInput extends GenericInput,
> = GenericPredicate extends (input: GenericInput) => input is GenericPredicatedInput
	? IsEqual<Predicate<GenericPredicate>, any> extends true
		? GenericInput
		: Exclude<GenericInput, GenericPredicatedInput>
	: GenericInput;

export function whenNot<
	GenericInput extends AnyValue,
	GenericPredicatedInput extends GenericInput,
	GenericOutput extends AnyValue | EscapeVoid,
	GenericPredicate extends unknown = (input: BreakGenericLink<GenericInput>) => input is GenericPredicatedInput,
>(
	ifFunction: (
		& ((input: BreakGenericLink<GenericInput>) => input is GenericPredicatedInput)
		& FixDeepFunctionInfer<
			(input: BreakGenericLink<GenericInput>) => input is GenericPredicatedInput,
			GenericPredicate
		>
		& IsPredicateOutputCompatible<GenericInput, GenericPredicatedInput, GenericPredicate>
	),
	theFunction: (predicatedInput: ComputeCallbackInput<
		GenericInput,
		GenericPredicate,
		GenericPredicatedInput
	>) => GenericOutput,
): (input: GenericInput) => (
	| GenericOutput
	| BreakGenericLink<GenericPredicatedInput>
);

export function whenNot<
	GenericInput extends AnyValue,
	GenericOutput extends AnyValue | EscapeVoid,
>(
	ifFunction: (input: BreakGenericLink<GenericInput>) => boolean,
	theFunction: (predicatedInput: BreakGenericLink<GenericInput>) => GenericOutput,
): (
	input: GenericInput,
) => (
	| GenericOutput
	| GenericInput
);

export function whenNot<
	GenericInput extends AnyValue,
	GenericPredicatedInput extends GenericInput,
	GenericOutput extends AnyValue | EscapeVoid,
	GenericPredicate extends unknown = (input: BreakGenericLink<GenericInput>) => input is GenericPredicatedInput,
>(
	input: GenericInput,
	ifFunction: (
		& ((input: BreakGenericLink<GenericInput>) => input is GenericPredicatedInput)
		& FixDeepFunctionInfer<
			(input: BreakGenericLink<GenericInput>) => input is GenericPredicatedInput,
			GenericPredicate
		>
		& IsPredicateOutputCompatible<GenericInput, GenericPredicatedInput, GenericPredicate>
	),
	theFunction: (predicatedInput: ComputeCallbackInput<
		GenericInput,
		GenericPredicate,
		GenericPredicatedInput
	>) => GenericOutput,
): (
	| GenericOutput
	| GenericPredicatedInput
);

export function whenNot<
	GenericInput extends AnyValue,
	GenericOutput extends AnyValue | EscapeVoid,
>(
	input: GenericInput,
	ifFunction: (input: BreakGenericLink<GenericInput>) => boolean,
	theFunction: (predicatedInput: BreakGenericLink<GenericInput>) => GenericOutput,
): (
	| GenericOutput
	| GenericInput
);

export function whenNot(
	...args:
		| [ifFunction: AnyFunction, theFunction: AnyFunction]
		| [input: AnyValue, ifFunction: AnyFunction, theFunction: AnyFunction]
): any {
	if (args.length === 2) {
		const [ifFunction, theFunction] = args;

		return (input: AnyValue) => whenNot(
			input,
			ifFunction as never,
			theFunction as never,
		);
	}

	const [input, ifFunction, theFunction] = args;

	if (!ifFunction(input)) {
		return theFunction(input);
	}

	return input;
}
