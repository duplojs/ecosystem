import { GreaterThanConstraint } from "../constraint";

export function greaterThan<
	GenericThreshold extends number,
>(threshold: GenericThreshold) {
	return GreaterThanConstraint(threshold);
}
