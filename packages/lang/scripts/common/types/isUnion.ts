import type { IsEqual } from "./isEqual";
import { type LastUnionElement } from "./lastUnionElement";
import { type Not } from "./not";

export type IsUnion<
	GenericValue extends unknown,
> = IsEqual<GenericValue, never> extends true
	? false
	: Not<IsEqual<GenericValue, LastUnionElement<GenericValue>>>;
