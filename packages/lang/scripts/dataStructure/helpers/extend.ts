import type * as DObject from "@scripts/object";
import { ObjectStructure, type ShapeObjectStructureValue, type ShapeObjectStructure, type StructureInitialValue } from "../structure";

export function extend<
	GenericObjectStructure extends ObjectStructure,
	GenericShape extends ShapeObjectStructure,
>(
	structure: GenericObjectStructure,
	shape: GenericShape,
): ObjectStructure<
	DObject.Assign<
		Extract<StructureInitialValue<GenericObjectStructure>, object>,
		ShapeObjectStructureValue<GenericShape>
	>,
	readonly []
>;

export function extend(
	structure: ObjectStructure,
	shape: ShapeObjectStructure,
): ObjectStructure {
	return ObjectStructure(
		{
			...Object.fromEntries(
				structure.definition.shape.value.map(
					(entry) => [
						entry.key,
						entry.value,
					],
				),
			),
			...shape,
		},
		[],
	);
}
