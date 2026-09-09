import type { EscapeVoid, AnyFunction, AnyValue, BreakGenericLink } from "./types";

export function whenElse<
	GenericInput extends AnyValue,
	GenericPredicatedInput extends GenericInput,
	GenericOutput1 extends AnyValue | EscapeVoid,
	GenericOutput2 extends AnyValue | EscapeVoid,
>(
	predicate: (input: GenericInput) => input is GenericPredicatedInput,
	thenFunction: (predicatedInput: Extract<GenericInput, GenericPredicatedInput>) => GenericOutput1,
	elseFunction: (excludedInput: Exclude<GenericInput, GenericPredicatedInput>) => GenericOutput2,
): (input: GenericInput) => BreakGenericLink<GenericOutput1> | BreakGenericLink<GenericOutput2>;

export function whenElse<
	GenericInput extends AnyValue,
	GenericPredicatedInput extends GenericInput,
	GenericOutput1 extends AnyValue | EscapeVoid,
	GenericOutput2 extends AnyValue | EscapeVoid,
>(
	input: GenericInput,
	predicate: (input: GenericInput) => input is GenericPredicatedInput,
	thenFunction: (predicatedInput: Extract<GenericInput, GenericPredicatedInput>) => GenericOutput1,
	elseFunction: (excludedInput: Exclude<GenericInput, GenericPredicatedInput>) => GenericOutput2,
): GenericOutput1 | GenericOutput2;

export function whenElse<
	GenericInput extends AnyValue,
	GenericOutput1 extends AnyValue | EscapeVoid,
	GenericOutput2 extends AnyValue | EscapeVoid,
>(
	predicate: (input: GenericInput) => boolean,
	thenFunction: (input: GenericInput) => GenericOutput1,
	elseFunction: (input: GenericInput) => GenericOutput2,
): (input: GenericInput) =>
	| GenericOutput1
	| GenericOutput2;

export function whenElse<
	GenericInput extends AnyValue,
	GenericOutput1 extends AnyValue | EscapeVoid,
	GenericOutput2 extends AnyValue | EscapeVoid,
>(
	input: GenericInput,
	predicate: (input: GenericInput) => boolean,
	thenFunction: (input: GenericInput) => GenericOutput1,
	elseFunction: (input: GenericInput) => GenericOutput2,
): BreakGenericLink<GenericOutput1> | BreakGenericLink<GenericOutput2>;

export function whenElse(
	...args:
		| [input: AnyValue, predicate: AnyFunction, thenFunction: AnyFunction, elseFunction: AnyFunction]
		| [predicate: AnyFunction, thenFunction: AnyFunction, elseFunction: AnyFunction]
): any {
	if (args.length === 3) {
		const [predicate, thenFunction, elseFunction] = args;

		return (input: AnyValue) => whenElse(
			input,
			predicate as never,
			thenFunction as never,
			elseFunction,
		);
	}

	const [input, predicate, thenFunction, elseFunction] = args;

	if (predicate(input)) {
		return thenFunction(input);
	} else {
		return elseFunction(input);
	}
}
