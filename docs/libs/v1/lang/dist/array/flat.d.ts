import type * as DCommon from '../common';
import type * as DNumber from '../number';
type FlatOutput<GenericArray extends readonly unknown[], GenericDepth extends number> = readonly (GenericDepth extends unknown ? DCommon.And<[
    DNumber.IsInteger<GenericDepth>,
    DCommon.Not<DNumber.IsNegative<GenericDepth>>
]> extends true ? FlatArray<GenericArray, GenericDepth> : unknown : never)[];
export declare function flat<const GenericArray extends readonly unknown[], const GenericDepth extends number = 1>(array: GenericArray, depth?: GenericDepth): FlatOutput<GenericArray, GenericDepth>;
export {};
