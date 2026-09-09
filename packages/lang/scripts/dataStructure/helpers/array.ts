import { type Constraint } from "../constraint";
import { ArrayStructure, type StructureValue, type Structure } from "../structure";

export function array<
	GenericStructure extends Structure,
	const GenericConstraints extends readonly Constraint<readonly StructureValue<GenericStructure>[]>[] = readonly [],
>(
	element: GenericStructure,
	constraints: GenericConstraints = [] as never,
) {
	return ArrayStructure(
		element,
		constraints,
	);
}
