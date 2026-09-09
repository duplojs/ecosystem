import type * as DCommon from "@scripts/common";
import type { HasAtMostElements } from "./hasAtMostElements";

export type RequireAtMostElements<
	GenericArray extends readonly unknown[],
	GenericMax extends number,
> = HasAtMostElements<GenericArray, GenericMax> extends true
	? unknown
	: DCommon.ComputedTypeError<`Array must have at most ${GenericMax} elements.`>;
