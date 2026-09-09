import { MinElementsConstraint } from "../constraint";

export function minElements<
	GenericMin extends number,
>(min: GenericMin) {
	return MinElementsConstraint(min);
}
