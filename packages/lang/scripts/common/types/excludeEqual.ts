import { type UnionContain } from "./unionContain";

export type ExcludeEqual<
	GenericUnion extends unknown,
	GenericValue extends unknown,
> = GenericUnion extends any
	? UnionContain<GenericValue, GenericUnion> extends true
		? never
		: GenericUnion
	: never;
