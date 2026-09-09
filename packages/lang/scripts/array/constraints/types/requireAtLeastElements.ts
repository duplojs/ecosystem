import type * as DCommon from "@scripts/common";
import type { HasAtLeastElements } from "./hasAtLeastElements";

export type RequireAtLeastElements<
	GenericArray extends readonly unknown[],
	GenericMin extends number,
> = HasAtLeastElements<GenericArray, GenericMin> extends true
	? unknown
	: DCommon.ComputedTypeError<`Array must have at least ${GenericMin} elements.`>;
