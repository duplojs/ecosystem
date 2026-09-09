import type * as DCommon from "@scripts/common";

export type UnionObjectToIntersection<
	GenericValue extends object,
> = DCommon.UnionToIntersection<GenericValue> extends infer InferredObject extends object
	? InferredObject
	: never;
