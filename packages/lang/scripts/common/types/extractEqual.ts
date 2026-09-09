import { type UnionContain } from "./unionContain";

export type ExtractEqual<
	GenericUnion extends unknown,
	GenericValue extends unknown,
> = GenericUnion extends any
	? UnionContain<GenericValue, GenericUnion> extends true
		? GenericUnion
		: never
	: never;
