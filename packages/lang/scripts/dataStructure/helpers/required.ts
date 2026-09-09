import { type ObjectStructure, type Structure, unionStructureKind, structureIdentifier, type StructureInitialValue, lazyStructureKind } from "../structure";
import { union } from "./union";
import { object } from "./object";
import { isUndefinedStructure } from "./isUndefinedStructure";
import type * as DCommon from "@scripts/common";
import { lazy } from "./lazy";

function requiredStructure(structure: Structure) {
	if (structureIdentifier(structure, lazyStructureKind)) {
		return requiredStructure(structure.definition.getter.value);
	}

	if (!structureIdentifier(structure, unionStructureKind)) {
		return structure;
	}

	const values = structure.definition.values.value.filter(
		(value) => !isUndefinedStructure(value),
	);

	if (values.length === 1) {
		return values[0]!;
	}

	if (values.length === structure.definition.values.value.length) {
		return structure;
	}

	return union(values as [Structure, ...Structure[]]);
}

export function required<
	GenericObjectStructure extends ObjectStructure,
	GenericObjectStructureValue extends StructureInitialValue<GenericObjectStructure>,
>(
	structure: GenericObjectStructure,
): ObjectStructure<
	{
		readonly [Prop in keyof GenericObjectStructureValue]-?: DCommon.IsEqual<
			GenericObjectStructureValue[Prop],
			undefined
		> extends true
			? undefined
			: Exclude<
				GenericObjectStructureValue[Prop],
				undefined
			>
	},
	readonly []
>;

export function required(
	structure: ObjectStructure,
): ObjectStructure {
	return object(
		Object.fromEntries(
			structure.definition.shape.value.map(
				(entry) => [
					entry.key,
					lazy(() => requiredStructure(entry.value)),
				],
			),
		),
	);
}
