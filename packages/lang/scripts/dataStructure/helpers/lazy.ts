import { type Constraint } from "../constraint";
import { LazyStructure, type StructureValue, type Structure } from "../structure";

export function lazy<
	GenericStructure extends Structure,
	const GenericConstraints extends readonly Constraint<StructureValue<GenericStructure>>[] = readonly [],
>(
	getStructure: () => GenericStructure,
	constraints: GenericConstraints = [] as never,
) {
	return LazyStructure(
		getStructure,
		constraints,
	);
}
