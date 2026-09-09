import { BetweenThanConstraint } from "../constraint";

export function betweenThan<
	GenericGreater extends number,
	GenericLess extends number,
>(
	greater: GenericGreater,
	less: GenericLess,
) {
	return BetweenThanConstraint(greater, less);
}
