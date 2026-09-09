import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { NullType } from "../type";

function nullHelper<
	const GenericConstraints extends readonly Constraint<null>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		NullType(),
		constraints,
	);
}

export { nullHelper as null };
