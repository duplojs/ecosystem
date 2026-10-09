import { FlatAsyncIterator } from './types';
export declare function asyncFlat<const GenericItem extends unknown, const GenericDepth extends number = 1>(iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>, depth?: GenericDepth): AsyncGenerator<FlatAsyncIterator<GenericItem, GenericDepth>, void, unknown>;
