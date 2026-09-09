import { LessThanConstraint } from "../constraint";

export function lessThan<
	GenericThreshold extends number,
>(threshold: GenericThreshold) {
	return LessThanConstraint(threshold);
}
