import { FlatIterator } from './types';
export declare function flat<const GenericItem extends unknown, const GenericDepth extends number = 1>(iterator: Iterable<GenericItem>, depth?: GenericDepth): Generator<FlatIterator<GenericItem, GenericDepth>, void, unknown>;
