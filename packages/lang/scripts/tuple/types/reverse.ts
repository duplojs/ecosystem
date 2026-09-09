import type * as DCommon from "@scripts/common";

export type Reverse<
	GenericTuple extends DCommon.AnyTuple,
> = GenericTuple extends readonly [infer InferredValue, ...infer InferredRest extends DCommon.AnyTuple]
	? [...Reverse<InferredRest>, InferredValue]
	: GenericTuple;
