import { StartsWithConstraint } from "../constraint";

export function startsWith<
	GenericSearchString extends string,
>(searchString: GenericSearchString) {
	return StartsWithConstraint(searchString);
}
