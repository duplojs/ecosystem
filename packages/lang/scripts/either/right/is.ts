import { informationKind, valueKind } from "../kind";
import { rightKind, type Right } from "./create";

export function isRight<
	GenericInput extends unknown,
>(
	input: GenericInput,
): input is Extract<GenericInput, Right>;

export function isRight(
	input: unknown,
) {
	return rightKind.has(input)
		&& informationKind.has(input)
		&& valueKind.has(input);
}
