import { HasKeySignature, keyofWithoutSignature } from './types';
import * as DCommon from '../common';
import type * as DKind from '../kind';
type DeepOverrideParameter<GenericValue extends unknown> = (GenericValue extends unknown ? readonly [
    GenericValue,
    DCommon.RemoveConstraint<GenericValue>
] : never) extends infer InferredItem extends readonly [unknown, unknown] ? DCommon.IsUnion<Extract<InferredItem[1], object>> extends true ? Exclude<InferredItem[1], object> | undefined : InferredItem extends unknown ? InferredItem[1] extends DCommon.AnyFunction ? InferredItem[0] : InferredItem[1] extends object ? InferredItem[0] extends DCommon.Constraint ? undefined : InferredItem[1] extends readonly unknown[] ? InferredItem[1] extends readonly [
    infer InferredFirst,
    ...infer InferredRest
] ? readonly [
    DeepOverrideParameter<InferredFirst> | undefined,
    ...Extract<DeepOverrideParameter<InferredRest>, readonly unknown[]>
] : InferredItem[1] extends readonly [] ? readonly [] : readonly (DeepOverrideParameter<InferredItem[1][number]> | undefined)[] : DCommon.SimplifyTopLevel<{
    readonly [Prop in Exclude<keyofWithoutSignature<InferredItem[1]>, DKind.KeySymbol>]?: DeepOverrideParameter<InferredItem[1][Prop]> | undefined;
} & (HasKeySignature<InferredItem[1]> extends true ? {
    readonly [key: string]: InferredItem[1][keyof InferredItem[1]];
} : unknown)> : InferredItem[0] | undefined : never : never;
export declare function deepOverride<GenericObject extends object>(value: NoInfer<DeepOverrideParameter<GenericObject>>): (object: GenericObject) => GenericObject;
export declare function deepOverride<GenericObject extends object>(object: GenericObject, value: NoInfer<DeepOverrideParameter<GenericObject>>): GenericObject;
export {};
