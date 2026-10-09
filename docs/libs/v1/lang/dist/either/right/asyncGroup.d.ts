import * as DCommon from '../../common';
import * as DEither from '..';
type Either = DCommon.MaybePromise<DEither.Right | DEither.Left>;
type AsyncGroupOutput<GenericGroup extends (Record<string, DCommon.MayBeGetter<Either>> | readonly DCommon.MayBeGetter<Either>[])> = Extract<Promise<DEither.Success<DCommon.SimplifyTopLevel<{
    -readonly [Prop in keyof GenericGroup]: GenericGroup[Prop] extends infer InferredValue ? InferredValue extends DCommon.AnyFunction ? DEither.GetValue<Extract<Awaited<ReturnType<InferredValue>>, DEither.Right>> : DEither.GetValue<Extract<Awaited<InferredValue>, DEither.Right>> : never;
}>> | (GenericGroup extends readonly (infer InferredElement)[] ? InferredElement extends DCommon.AnyFunction ? Extract<Awaited<ReturnType<InferredElement>>, DEither.Left> : Extract<Awaited<InferredElement>, DEither.Left> : {
    [Prop in Exclude<keyof GenericGroup, keyof any[]>]: GenericGroup[Prop] extends DCommon.AnyFunction ? Extract<Awaited<ReturnType<GenericGroup[Prop]>>, DEither.Left> : Extract<Awaited<GenericGroup[Prop]>, DEither.Left>;
}[Exclude<keyof GenericGroup, keyof any[]>])>, any>;
export declare function asyncGroup<const GenericGroup extends (Record<string, DCommon.MayBeGetter<Either>> | readonly DCommon.MayBeGetter<Either>[])>(group: GenericGroup): Extract<AsyncGroupOutput<GenericGroup>, any>;
export {};
