import { MaxElementsConstraint } from "../constraint";

export function maxElements<
	GenericMax extends number,
>(max: GenericMax) {
	return MaxElementsConstraint(max);
}
