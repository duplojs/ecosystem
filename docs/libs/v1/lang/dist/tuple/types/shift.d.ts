import type * as DCommon from '../../common';
export type Shift<GenericTuple extends DCommon.AnyTuple> = GenericTuple extends readonly [any, ...infer InferredRest] ? InferredRest : never;
