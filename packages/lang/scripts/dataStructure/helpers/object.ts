import { type Constraint } from "../constraint";
import { ObjectStructure, type ShapeObjectStructureValue, type ShapeObjectStructure } from "../structure";

export function object<
	GenericShape extends ShapeObjectStructure,
	const GenericConstraints extends readonly Constraint<ShapeObjectStructureValue<GenericShape>>[] = readonly [],
>(
	shape: GenericShape,
	constraints: GenericConstraints = [] as never,
) {
	return ObjectStructure(
		shape,
		constraints,
	);
}
