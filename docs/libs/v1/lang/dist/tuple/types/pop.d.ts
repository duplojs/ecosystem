import type * as DCommon from '../../common';
export type Pop<GenericTuple extends DCommon.AnyTuple> = GenericTuple extends readonly [...infer InferredRest, any] ? InferredRest : never;
