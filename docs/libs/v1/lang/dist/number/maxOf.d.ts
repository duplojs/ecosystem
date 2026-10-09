import type * as DArray from '../array';
export declare function maxOf<GenericValues extends readonly number[]>(values: GenericValues & DArray.RequireAtLeastElements<GenericValues, 1>): number;
