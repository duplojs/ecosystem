import { LessThanOrEqualConstraint } from "../constraint";

export function lessThanOrEqual<
	GenericThreshold extends number,
>(threshold: GenericThreshold) {
	return LessThanOrEqualConstraint(threshold);
}
