import { lazyStructureKind, structureIdentifier, unionStructureKind, type Structure } from "../structure";
import { isUndefinedStructure } from "./isUndefinedStructure";

export function isOptional(structure: Structure): boolean {
	if (structureIdentifier(structure, lazyStructureKind)) {
		return isOptional(structure.definition.getter.value);
	}

	if (!structureIdentifier(structure, unionStructureKind)) {
		return isUndefinedStructure(structure);
	}

	return structure.definition.values.value.some(
		isUndefinedStructure,
	);
}
