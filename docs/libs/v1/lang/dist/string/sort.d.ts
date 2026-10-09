import type * as DCommon from '../common';
import type * as DArray from '../array';
type SortOutput<GenericArray extends readonly string[]> = DArray.ReapplyCompatiblesConstraints<GenericArray, GenericArray[number][]>;
export declare function sort<GenericArray extends readonly string[]>(type: DCommon.SortType): (array: GenericArray) => SortOutput<GenericArray>;
export declare function sort<GenericArray extends readonly string[]>(array: GenericArray, type: DCommon.SortType): SortOutput<GenericArray>;
export {};
