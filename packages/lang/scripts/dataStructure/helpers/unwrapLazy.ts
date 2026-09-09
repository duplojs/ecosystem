import { lazyStructureKind, type Structure, structureIdentifier, type StructureValue } from "../structure";

export function unwrapLazy<
	GenericStructure extends Structure,
>(
	structure: GenericStructure,
): Structure<StructureValue<GenericStructure>>;

export function unwrapLazy(structure: Structure): Structure {
	if (structureIdentifier(structure, lazyStructureKind)) {
		return structure.definition.getter.value as never;
	}

	return structure;
}
