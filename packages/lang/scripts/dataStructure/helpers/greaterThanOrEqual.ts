import { GreaterThanOrEqualConstraint } from "../constraint";

export function greaterThanOrEqual<
	GenericThreshold extends number,
>(threshold: GenericThreshold) {
	return GreaterThanOrEqualConstraint(threshold);
}
