import { lazyStructureKind, structureIdentifier, unionStructureKind, type Structure } from "../structure";
import { isNullStructure } from "./isNullStructure";

export function isNullable(structure: Structure): boolean {
	if (structureIdentifier(structure, lazyStructureKind)) {
		return isNullable(structure.definition.getter.value);
	}

	if (!structureIdentifier(structure, unionStructureKind)) {
		return isNullStructure(structure);
	}

	return structure.definition.values.value.some(
		isNullStructure,
	);
}
