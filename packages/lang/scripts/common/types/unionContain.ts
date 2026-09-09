import type { IsEqual } from "./isEqual";

export type UnionContain<
	GenericUnion extends unknown,
	GenericValue extends unknown,
> = (
	GenericValue extends any
		? boolean extends (
			| (
				GenericUnion extends any
					? IsEqual<GenericUnion, GenericValue>
					: never
			)
			| false
		)
			? true
			: false
		: never
) extends true
	? true
	: false;
