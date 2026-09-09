import type { Left } from "./create";
import { isLeft } from "./is";
import { valueKind } from "../kind";
import type { GetValue } from "../types";

export function unwrapLeft<
	GenericInput extends unknown,
>(
	input: GenericInput,
): GenericInput extends Left
	? GetValue<GenericInput>
	: GenericInput;

export function unwrapLeft(
	input: unknown,
) {
	if (isLeft(input)) {
		return valueKind.getValue(input);
	}

	return input;
}
