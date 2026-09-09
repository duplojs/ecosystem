import { type Structure, structureIdentifier, typeStructureKind } from "../structure";
import { typeIdentifier, undefinedTypeKind } from "../type";

export function isUndefinedStructure(structure: Structure) {
	return (
		structureIdentifier(structure, typeStructureKind)
		&& typeIdentifier(
			structure.definition.type,
			undefinedTypeKind,
		)
	);
}
