import { IncludeConstraint } from "../constraint";

export function include<
	GenericSearchString extends string,
>(searchString: GenericSearchString) {
	return IncludeConstraint(searchString);
}
