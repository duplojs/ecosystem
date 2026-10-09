import { FlatObject, GetPropsWithValueExtends, UnFlatObject } from './types';
import * as DCommon from '../common';
type ObjectProjection<GenericInput extends object> = FlatObject<GenericInput> extends infer InferredResult extends object ? Omit<Pick<InferredResult, GetPropsWithValueExtends<InferredResult, DCommon.EligibleEqual>>, `${string}[${string}]${string}`> : never;
export declare function deepDiscriminate<GenericInput extends object, GenericObjectProjection extends ObjectProjection<GenericInput>, GenericPath extends keyof GenericObjectProjection, GenericValue extends Extract<GenericObjectProjection[GenericPath], DCommon.EligibleEqual>>(path: GenericPath, value: DCommon.MaybeArray<GenericValue>): (input: GenericInput) => input is Extract<GenericInput, UnFlatObject<{
    [Prop in GenericPath]: GenericValue;
}>>;
export declare function deepDiscriminate<GenericInput extends object, GenericObjectProjection extends ObjectProjection<GenericInput>, GenericPath extends keyof GenericObjectProjection, GenericValue extends Extract<GenericObjectProjection[GenericPath], DCommon.EligibleEqual>>(input: GenericInput, path: GenericPath, value: DCommon.MaybeArray<GenericValue>): input is Extract<GenericInput, UnFlatObject<{
    [Prop in GenericPath]: GenericValue;
}>>;
export {};
