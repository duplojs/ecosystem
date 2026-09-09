import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { NumberType } from "../type";

export function number<
	const GenericConstraints extends readonly Constraint<number>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		NumberType(),
		constraints,
	);
}
