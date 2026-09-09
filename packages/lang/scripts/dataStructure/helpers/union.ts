import type * as DCommon from "@scripts/common";
import { UnionStructure, type Structure, type StructureValue } from "../structure";
import { type Constraint } from "../constraint";

export function union<
	GenericValues extends DCommon.AnyTuple<Structure>,
	const GenericConstraints extends readonly Constraint<
		StructureValue<GenericValues[number]>
	>[] = readonly [],
>(
	values: GenericValues,
	constraints: GenericConstraints = [] as never,
) {
	return UnionStructure(values, constraints);
}
