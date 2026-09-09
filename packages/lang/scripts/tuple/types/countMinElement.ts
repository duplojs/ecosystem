import type * as DCommon from "@scripts/common";

export type CountMinElement<
	GenericTuple extends DCommon.AnyTuple,
	GenericAccumulator extends readonly never[] = [],
> = number extends GenericTuple["length"]
	? GenericTuple extends readonly [infer __, ...infer InferredRest]
		? [...GenericAccumulator, never] extends infer InferredAccumulator extends readonly never[]
			? InferredRest extends DCommon.AnyTuple
				? CountMinElement<
					InferredRest,
					InferredAccumulator
				>
				: InferredAccumulator["length"]
			: never
		: never
	: GenericTuple["length"];
