import type * as DChrono from "@scripts/chrono";
import { type Constraint } from "../constraint";
import { TypeStructure } from "../structure";
import { DateType } from "../type";

export function date<
	const GenericConstraints extends readonly Constraint<DChrono.TheDate>[] = readonly [],
>(
	constraints: GenericConstraints = [] as never,
) {
	return TypeStructure(
		DateType(),
		constraints,
	);
}
