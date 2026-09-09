import { type Structure, structureIdentifier, typeStructureKind } from "../structure";
import { nullTypeKind, typeIdentifier } from "../type";

export function isNullStructure(structure: Structure) {
	return (
		structureIdentifier(structure, typeStructureKind)
		&& typeIdentifier(
			structure.definition.type,
			nullTypeKind,
		)
	);
}
