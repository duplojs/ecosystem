import type * as DCommon from "@scripts/common";

export type Pop<
	GenericTuple extends DCommon.AnyTuple,
> = GenericTuple extends readonly [...infer InferredRest, any]
	? InferredRest
	: never;
