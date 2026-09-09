
import { type ExcludeEqual } from "./excludeEqual";
import { type IsNever } from "./isNever";
import { type LastUnionElement } from "./lastUnionElement";

type Remove<
	GenericValue extends unknown,
	GenericLast extends GenericValue,
> = (
	| GenericLast
	| RemoveDuplicateInUnion<
		ExcludeEqual<GenericValue, GenericLast>
	>
);

export type RemoveDuplicateInUnion<
	GenericValue extends unknown,
> = IsNever<GenericValue> extends true
	? never
	: Remove<GenericValue, LastUnionElement<GenericValue>>;
