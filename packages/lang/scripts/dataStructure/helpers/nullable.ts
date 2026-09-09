import { type Structure, type StructureInitialValue, type StructureValue, type UnionStructure, structureIdentifier, unionStructureKind } from "../structure";
import { union } from "./union";
import { null as nullHelper } from "./null";
import { isNullStructure } from "./isNullStructure";
import { lazy } from "./lazy";

export function nullable<
	GenericStructure extends Structure,
>(
	structure: GenericStructure,
): UnionStructure<
	(
		GenericStructure extends UnionStructure
			? StructureInitialValue<GenericStructure>
			: StructureValue<GenericStructure>
	) | null,
	readonly []
>;

export function nullable(
	structure: Structure,
): UnionStructure {
	return union([
		lazy(
			() => {
				if (structureIdentifier(structure, unionStructureKind)) {
					return structure.definition.values.value.some(isNullStructure)
						? structure
						: union([
							nullHelper(),
							union(structure.definition.values.value),
						]);
				}

				return union([
					nullHelper(),
					structure,
				]);
			},
		),
	]);
}
