import { EndsWithConstraint } from "../constraint";

export function endsWith<
	GenericSearchString extends string,
>(searchString: GenericSearchString) {
	return EndsWithConstraint(searchString);
}
