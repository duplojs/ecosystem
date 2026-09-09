import { AssertsError } from "./asserts";
import type { AnyFunction, AnyPredicate } from "./types";

export function forwardAsserts<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	predicate: (
		input: GenericInput,
	) => input is GenericPredicate,
): (
	input: GenericInput,
) => GenericPredicate;

export function forwardAsserts<
	GenericInput extends unknown,
>(
	predicate: (
		input: GenericInput,
	) => boolean,
): (
	input: GenericInput,
) => GenericInput;

export function forwardAsserts<
	GenericInput extends unknown,
	GenericPredicate extends GenericInput,
>(
	input: GenericInput,
	predicate: (
		input: GenericInput,
	) => input is GenericPredicate,
): GenericPredicate;

export function forwardAsserts<
	GenericInput extends unknown,
>(
	input: GenericInput,
	predicate: (
		input: GenericInput,
	) => boolean,
): GenericInput;

export function forwardAsserts(
	...args:
		| [input: unknown, predicate: AnyPredicate | AnyFunction]
		| [predicate: AnyPredicate | AnyFunction]
) {
	if (args.length === 1) {
		const [predicate] = args;

		return (input: unknown) => forwardAsserts(input, predicate);
	}

	const [input, predicate] = args;

	if (!predicate(input)) {
		throw new AssertsError(input);
	}

	return input;
}
