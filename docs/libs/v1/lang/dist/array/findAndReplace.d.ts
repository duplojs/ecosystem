import { ReapplyCompatiblesConstraints } from './constraints';
import type * as DCommon from '../common';
export interface FindAndReplacePredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
type FindAndReplaceOutput<GenericArray extends readonly unknown[], GenericValue extends DCommon.AnyValue> = GenericArray extends unknown ? (ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericValue)[]> | undefined) : never;
export declare function findAndReplace<GenericArray extends readonly unknown[], GenericValue extends DCommon.AnyValue>(predicate: (element: GenericArray[number], params: FindAndReplacePredicateFunctionParams<GenericArray>) => boolean, value: GenericValue): (array: GenericArray) => Extract<FindAndReplaceOutput<GenericArray, GenericValue>, any>;
export declare function findAndReplace<GenericArray extends readonly unknown[], GenericValue extends DCommon.AnyValue>(array: GenericArray, predicate: (element: GenericArray[number], params: FindAndReplacePredicateFunctionParams<GenericArray>) => boolean, value: GenericValue): Extract<FindAndReplaceOutput<GenericArray, GenericValue>, any>;
export {};
