import type * as DArray from '../array';
import * as DNumber from '../number';
type AsyncChunkOutput<GenericItem extends unknown, GenericSize extends number> = AsyncGenerator<readonly GenericItem[] & DArray.MinElements<1> & (DNumber.IsPositiveInteger<GenericSize> extends true ? DArray.MaxElements<GenericSize> : unknown), unknown, unknown>;
export declare function asyncChunk<const GenericItem extends unknown, GenericSize extends number>(size: GenericSize): (iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>) => AsyncChunkOutput<GenericItem, GenericSize>;
export declare function asyncChunk<const GenericItem extends unknown, GenericSize extends number>(iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>, size: GenericSize): AsyncChunkOutput<GenericItem, GenericSize>;
export {};
