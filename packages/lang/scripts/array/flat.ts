import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

type FlatOutput<
	GenericArray extends readonly unknown[],
	GenericDepth extends number,
> = readonly (
	GenericDepth extends unknown
		? DCommon.And<[
			DNumber.IsInteger<GenericDepth>,
			DCommon.Not<DNumber.IsNegative<GenericDepth>>,
		]> extends true
			? FlatArray<GenericArray, GenericDepth>
			: unknown
		: never
)[];

export function flat<
	const GenericArray extends readonly unknown[],
	const GenericDepth extends number = 1,
>(
	array: GenericArray,
	depth?: GenericDepth,
): FlatOutput<GenericArray, GenericDepth>;

export function flat(array: readonly unknown[], depth?: number): any {
	return array.flat(depth);
}
