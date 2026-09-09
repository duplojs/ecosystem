import type { UnionContain } from "./unionContain";

export type RemoveFromUnion<
	GenericUnion extends unknown,
	GenericValue extends unknown,
> = GenericUnion extends unknown
	? UnionContain<GenericValue, GenericUnion> extends true
		? never
		: GenericUnion
	: never;
