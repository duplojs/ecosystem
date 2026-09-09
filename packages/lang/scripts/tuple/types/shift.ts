import type * as DCommon from "@scripts/common";

export type Shift<
	GenericTuple extends DCommon.AnyTuple,
> = GenericTuple extends readonly [any, ...infer InferredRest]
	? InferredRest
	: never;
