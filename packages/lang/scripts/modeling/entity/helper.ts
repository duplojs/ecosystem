import type * as DCommon from "@scripts/common";
import type * as DDataStructure from "@scripts/dataStructure";
import type * as DString from "@scripts/string";
import { type Entity, EntityStructure } from "./base";
import { type NewType } from "../newType";

export type ForbiddenMissingNewTypeInEntityShape<
	GenericValue extends unknown,
	GenericPath extends readonly string[] = readonly [],
> = GenericValue extends NewType | null
	? never
	: GenericValue extends object
		? DCommon.Or<[
			DCommon.IsExtends<GenericValue, readonly any[]>,
			DCommon.And<[
				DCommon.IsExtends<keyof GenericValue, string>,
				DCommon.Not<DCommon.IsExtends<DCommon.AnyFunction, GenericValue[keyof GenericValue]>>,
			]>,
		]> extends true
			? {
				[Prop in keyof GenericValue]: ForbiddenMissingNewTypeInEntityShape<
					GenericValue[Prop],
					readonly [...GenericPath, `${Extract<Prop, string | number>}`]
				>
			}[keyof GenericValue]
			: GenericValue extends Entity
				? never
				: DCommon.ComputedTypeError<`Value at '${DString.Join<GenericPath>}' is not a NewType.`>
		: DCommon.ComputedTypeError<`Value at '${DString.Join<GenericPath>}' is not a NewType.`>;

export function createEntity<
	GenericName extends Capitalize<string>,
	GenericShape extends DDataStructure.ShapeObjectStructure,
>(
	name: GenericName,
	shape: () => (
		& GenericShape
		& DCommon.NeverCoalescing<
			ForbiddenMissingNewTypeInEntityShape<
				DDataStructure.ShapeObjectStructureValue<GenericShape>
			>,
			unknown
		>
	),
) {
	return EntityStructure(
		name,
		shape,
	);
}
