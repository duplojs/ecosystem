import { cast } from "./cast";
import { type ConstraintInput, type RemoveConstraint } from "./types";

export function createConstraintFactory<
	GenericExpectedValue extends unknown,
>(): <const GenericInput extends RemoveConstraint<GenericExpectedValue>>(
	input: ConstraintInput<GenericInput, GenericExpectedValue>,
) => GenericInput & GenericExpectedValue {
	return cast;
}
