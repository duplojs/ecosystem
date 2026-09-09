import type * as DCommon from "@scripts/common";
import { type Left } from "./left";
import { isRight, type Right } from "./right";
import { type GetValue } from "./types";
import { valueKind } from "./kind";

type Either = Right | Left;

export function unwrapOtherwise<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericValue extends unknown,
>(
	input: GenericInput,
	value: () => GenericValue,
): (
	| GetValue<Extract<GenericInput, Right>>
	| GenericValue
);

export function unwrapOtherwise<
	GenericInput extends Either | DCommon.AnyValue,
	const GenericValue extends unknown,
>(
	value: () => GenericValue,
): (input: GenericInput) => (
	| GetValue<Extract<GenericInput, Right>>
	| GenericValue
);

export function unwrapOtherwise(
	...args:
		| [input: unknown, value: () => unknown]
		| [value: () => unknown]
): any {
	if (args.length === 1) {
		const [value] = args;

		return (input: unknown) => unwrapOtherwise(input as never, value);
	}

	const [input, value] = args;

	if (isRight(input)) {
		return valueKind.getValue(input);
	}

	return value();
}
