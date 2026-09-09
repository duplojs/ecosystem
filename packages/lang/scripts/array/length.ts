import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

type LengthOutput<
	GenericArray extends readonly unknown[],
> = GenericArray extends unknown
	? DCommon.IsEqual<GenericArray["length"], number> extends true
		? number & DNumber.Positive
		: DNumber.IsGreater<GenericArray["length"], 0> extends true
			? GenericArray["length"] & DNumber.StrictPositive
			: 0 & DNumber.Positive
	: never;

export function length<
	GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): LengthOutput<GenericArray>;

export function length(
	array: readonly unknown[],
) {
	return array.length;
}
