import type * as DCommon from "@scripts/common";
import type * as DDataStructure from "@scripts/dataStructure";
import { type NewType, NewTypeStructure } from "./base";

export type ForbiddenTopLevelNewType<
	GenericValue extends unknown,
> = GenericValue extends NewType
	? DCommon.ComputedTypeError<"NewType on top level of NewType declaration is forbidden.">
	: never;

export function createNewType<
	GenericName extends Capitalize<string>,
	GenericStructure extends DDataStructure.Structure,
	const GenericNewTypeConstraint extends readonly DDataStructure.Constraint<
		DDataStructure.StructureValue<GenericStructure>
	>[] = readonly [],
>(
	name: (
		& GenericName
		& DCommon.NeverCoalescing<
			ForbiddenTopLevelNewType<
				DDataStructure.StructureValue<GenericStructure>
			>,
			unknown
		>
	),
	structure: GenericStructure,
	newTypeConstraints: GenericNewTypeConstraint = [] as never,
) {
	return NewTypeStructure(
		name,
		structure,
		newTypeConstraints,
	);
}
