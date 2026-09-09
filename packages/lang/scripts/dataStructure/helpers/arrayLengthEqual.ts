import { ArrayLengthEqualConstraint } from "../constraint";

export function arrayLengthEqual<
	GenericLength extends number,
>(length: GenericLength) {
	return ArrayLengthEqualConstraint(length);
}
