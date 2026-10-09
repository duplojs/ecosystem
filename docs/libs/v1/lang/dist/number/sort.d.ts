import type * as DArray from '../array';
import type * as DCommon from '../common';
type SortOutput<GenericArray extends readonly number[]> = GenericArray extends unknown ? DArray.ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][]> : never;
export declare function sort<GenericArray extends readonly number[]>(type: DCommon.SortType): (array: GenericArray) => SortOutput<GenericArray>;
export declare function sort<GenericArray extends readonly number[]>(array: GenericArray, type: DCommon.SortType): SortOutput<GenericArray>;
export {};
