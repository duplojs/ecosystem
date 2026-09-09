import type * as DCommon from "@scripts/common";

export type IsCompromise<
	GenericTuple extends DCommon.AnyTuple,
> = GenericTuple extends readonly [...infer InferredRest]
	? unknown extends InferredRest[number]
		? true
		: false
	: false;
