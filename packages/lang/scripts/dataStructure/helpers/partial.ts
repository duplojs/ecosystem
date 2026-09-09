import { type ObjectStructure, type Structure, unionStructureKind, structureIdentifier, type StructureInitialValue, lazyStructureKind } from "../structure";
import { undefined as undefinedHelper } from "./undefined";
import { union } from "./union";
import { object } from "./object";
import { isUndefinedStructure } from "./isUndefinedStructure";
import { lazy } from "./lazy";

function partialStructure(structure: Structure) {
	if (structureIdentifier(structure, lazyStructureKind)) {
		return partialStructure(structure.definition.getter.value);
	}

	if (isUndefinedStructure(structure)) {
		return structure;
	}

	if (structureIdentifier(structure, unionStructureKind)) {
		return structure.definition.values.value.some(isUndefinedStructure)
			? structure
			: union([
				undefinedHelper(),
				...structure.definition.values.value,
			]);
	}

	return union([
		undefinedHelper(),
		structure,
	]);
}

export function partial<
	GenericObjectStructure extends ObjectStructure,
	GenericObjectStructureValue extends StructureInitialValue<GenericObjectStructure>,
>(
	structure: GenericObjectStructure,
): ObjectStructure<
	{
		readonly [Prop in keyof GenericObjectStructureValue]?: (
			| GenericObjectStructureValue[Prop]
			| undefined
		)
	},
	readonly []
>;

export function partial(
	structure: ObjectStructure,
): ObjectStructure {
	return object(
		Object.fromEntries(
			structure.definition.shape.value.map(
				(entry) => [
					entry.key,
					lazy(() => partialStructure(entry.value)),
				],
			),
		),
	);
}
