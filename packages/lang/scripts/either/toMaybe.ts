import { isLeft, none, type Left, type None } from "./left";
import { isRight, some, type Some, type Right } from "./right";

type Either = Right | Left;

export function toMaybe<
	GenericInput extends unknown,
>(
	input: GenericInput,
): (
	GenericInput extends Either
		? GenericInput
		: GenericInput extends null | undefined
			? None
			: Some<GenericInput>
);

export function toMaybe(
	input: unknown,
) {
	if (isRight(input) || isLeft(input)) {
		return input;
	}

	if (input === null || input === undefined) {
		return none();
	}

	return some(input);
}
