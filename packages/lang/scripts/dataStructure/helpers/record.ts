import { type Constraint } from "../constraint";
import { RecordStructure, type RecordStructureValue, type Structure, type TypeStructure, type UnionStructure } from "../structure";

export function record<
	GenericKey extends (
		| UnionStructure<string>
		| TypeStructure<string>
	),
	GenericValueStructure extends Structure,
	const GenericConstraints extends readonly Constraint<
		RecordStructureValue<
			GenericKey,
			GenericValueStructure
		>
	>[] = readonly [],
>(
	key: GenericKey,
	value: GenericValueStructure,
	constraints: GenericConstraints = [] as never,
) {
	return RecordStructure(
		key,
		value,
		constraints,
	);
}
