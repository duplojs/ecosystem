import type * as DArray from '../array';
export declare function minOf<GenericValues extends readonly number[]>(values: GenericValues & DArray.RequireAtLeastElements<GenericValues, 1>): number;
