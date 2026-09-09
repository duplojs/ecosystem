import { valueKind } from "../kind";
import type { Right } from "./create";
import { isRight } from "./is";
import type { GetValue } from "../types";

export function unwrapRight<
	GenericInput extends unknown,
>(
	input: GenericInput,
): GenericInput extends Right
	? GetValue<GenericInput>
	: GenericInput;

export function unwrapRight(
	input: unknown,
) {
	if (isRight(input)) {
		return valueKind.getValue(input);
	}

	return input;
}
