import { TypeStructure } from "../structure";
import { BigintType } from "../type";
import { type Constraint } from "../constraint";

export function bigint<
	const GenericConstraints extends readonly Constraint<bigint>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		BigintType(),
		constraints,
	);
}
