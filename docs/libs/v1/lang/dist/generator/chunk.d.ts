import type * as DArray from '../array';
import * as DNumber from '../number';
type ChunkOutput<GenericItem extends unknown, GenericSize extends number> = Generator<readonly GenericItem[] & DArray.MinElements<1> & (DNumber.IsPositiveInteger<GenericSize> extends true ? DArray.MaxElements<GenericSize> : unknown), unknown, unknown>;
export declare function chunk<const GenericItem extends unknown, GenericSize extends number>(size: GenericSize): (iterator: Iterable<GenericItem>) => ChunkOutput<GenericItem, GenericSize>;
export declare function chunk<const GenericItem extends unknown, GenericSize extends number>(iterator: Iterable<GenericItem>, size: GenericSize): ChunkOutput<GenericItem, GenericSize>;
export {};
