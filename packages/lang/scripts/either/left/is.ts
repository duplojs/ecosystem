import { leftKind, type Left } from "./create";
import { informationKind, valueKind } from "../kind";

export function isLeft<
	GenericInput extends unknown,
>(
	input: GenericInput,
): input is Extract<GenericInput, Left>;

export function isLeft(
	input: unknown,
) {
	return leftKind.has(input)
		&& informationKind.has(input)
		&& valueKind.has(input);
}
