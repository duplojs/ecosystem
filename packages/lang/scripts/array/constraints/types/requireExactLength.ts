import type * as DCommon from "@scripts/common";
import type { HasExactLength } from "./hasExactLength";

export type RequireExactLength<
	GenericArray extends readonly unknown[],
	GenericLength extends number,
> = HasExactLength<GenericArray, GenericLength> extends true
	? unknown
	: DCommon.ComputedTypeError<`Array must have exactly ${GenericLength} elements.`>;
