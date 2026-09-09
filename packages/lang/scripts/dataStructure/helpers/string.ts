import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { StringType } from "../type";

export function string<
	const GenericConstraints extends readonly Constraint<string>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		StringType(),
		constraints,
	);
}
