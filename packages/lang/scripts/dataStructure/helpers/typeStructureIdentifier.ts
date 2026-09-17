import type * as DKind from "@scripts/kind";
import type * as DArray from "@scripts/array";
import { type TypeStructure, type Structure, structureIdentifier, typeStructureKind } from "../structure";
import { type TypeValue, typeIdentifier, type Types } from "../type";

export function typeStructureIdentifier<
	GenericTypeKindHandler extends DArray.Unwrap<Parameters<typeof typeIdentifier>[1]>,
>(
	typeKind: GenericTypeKindHandler | GenericTypeKindHandler[],
): (structure: Structure) => structure is TypeStructure<
	TypeValue<
		Extract<
			Types,
			DKind.Kind<GenericTypeKindHandler>
		>
	>
>;

export function typeStructureIdentifier<
	GenericTypeKindHandler extends DArray.Unwrap<Parameters<typeof typeIdentifier>[1]>,
>(
	structure: Structure,
	typeKind: GenericTypeKindHandler | GenericTypeKindHandler[],
): structure is TypeStructure<
	TypeValue<
		Extract<
			Types,
			DKind.Kind<GenericTypeKindHandler>
		>
	>
>;

export function typeStructureIdentifier(
	...args:
		| [typeKind: Parameters<typeof typeIdentifier>[1]]
		| [structure: Structure, typeKind: Parameters<typeof typeIdentifier>[1]]
): boolean | ((structure: Structure) => boolean) {
	if (args.length === 1) {
		const [typeKind] = args;

		return (structure: Structure) => typeStructureIdentifier(
			structure,
			typeKind,
		);
	}

	const [structure, typeKind] = args;

	return (
		structureIdentifier(structure, typeStructureKind)
		&& typeIdentifier(structure.definition.type, typeKind)
	);
}
