import { BetweenThanOrEqualConstraint } from "../constraint";

export function betweenThanOrEqual<
	GenericGreater extends number,
	GenericLess extends number,
>(
	greater: GenericGreater,
	less: GenericLess,
) {
	return BetweenThanOrEqualConstraint(greater, less);
}
