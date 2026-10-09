import { Left } from '../left';
import { Right } from './create';
import { Success } from './success';
import { GetValue } from '../types';
import * as DCommon from '../../common';
type Either = Right | Left;
type ComputeResult<GenericGroup extends (Record<string, DCommon.MayBeGetter<Either>> | readonly DCommon.MayBeGetter<Either>[])> = (Success<DCommon.SimplifyTopLevel<{
    -readonly [Prop in keyof GenericGroup]: GenericGroup[Prop] extends infer InferredValue ? InferredValue extends DCommon.AnyFunction ? GetValue<Extract<ReturnType<InferredValue>, Right>> : GetValue<Extract<InferredValue, Right>> : never;
}>> | (GenericGroup extends readonly (infer InferredElement)[] ? InferredElement extends DCommon.AnyFunction ? Extract<ReturnType<InferredElement>, Left> : Extract<InferredElement, Left> : {
    [Prop in Exclude<keyof GenericGroup, keyof any[]>]: GenericGroup[Prop] extends DCommon.AnyFunction ? Extract<ReturnType<GenericGroup[Prop]>, Left> : Extract<GenericGroup[Prop], Left>;
}[Exclude<keyof GenericGroup, keyof any[]>]));
export declare function group<const GenericGroup extends (Record<string, DCommon.MayBeGetter<Either>> | readonly DCommon.MayBeGetter<Either>[])>(group: GenericGroup): Extract<ComputeResult<GenericGroup>, any>;
export {};
