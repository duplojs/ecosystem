import { type Structure, type StructureInitialValue, type StructureValue, type UnionStructure, structureIdentifier, unionStructureKind } from "../structure";
import { union } from "./union";
import { undefined as undefinedHelper } from "./undefined";
import { isUndefinedStructure } from "./isUndefinedStructure";
import { lazy } from "./lazy";

export function optional<
	GenericStructure extends Structure,
>(
	structure: GenericStructure,
): UnionStructure<
	(
		GenericStructure extends UnionStructure
			? StructureInitialValue<GenericStructure>
			: StructureValue<GenericStructure>
	) | undefined,
	readonly []
>;

export function optional(
	structure: Structure,
): UnionStructure {
	return union([
		lazy(
			() => {
				if (structureIdentifier(structure, unionStructureKind)) {
					return structure.definition.values.value.some(isUndefinedStructure)
						? structure
						: union([
							undefinedHelper(),
							union(structure.definition.values.value),
						]);
				}

				return union([
					undefinedHelper(),
					structure,
				]);
			},
		),
	]);
}
