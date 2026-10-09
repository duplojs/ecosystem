import { FlatObject, GetPropsWithValueExtends } from './types';
import type * as DCommon from '../common';
type ObjectProjection<GenericInput extends object> = FlatObject<GenericInput> extends infer InferredResult extends object ? Omit<Pick<InferredResult, GetPropsWithValueExtends<InferredResult, DCommon.EligibleEqual>>, `${string}[${string}]${string}`> : never;
export declare function getDeepProperty<GenericInput extends object, GenericObjectProjection extends ObjectProjection<GenericInput>, GenericPath extends keyof GenericObjectProjection>(path: GenericPath): (input: GenericInput) => GenericObjectProjection[GenericPath];
export declare function getDeepProperty<GenericInput extends object, GenericObjectProjection extends ObjectProjection<GenericInput>, GenericPath extends keyof GenericObjectProjection>(input: GenericInput, path: GenericPath): GenericObjectProjection[GenericPath];
export {};
