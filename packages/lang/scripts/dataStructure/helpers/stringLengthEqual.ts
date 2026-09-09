import { StringLengthEqualConstraint } from "../constraint";

export function stringLengthEqual<
	GenericLength extends number,
>(length: GenericLength) {
	return StringLengthEqualConstraint(length);
}
