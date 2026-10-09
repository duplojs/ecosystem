export interface AsyncFilterParams {
    index: number;
}
export declare function asyncFilter<const GenericItem extends unknown, const GenericOutput extends GenericItem>(predicate: (item: GenericItem, params: AsyncFilterParams) => item is GenericOutput): (iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>) => AsyncGenerator<GenericOutput, unknown, unknown>;
export declare function asyncFilter<const GenericItem extends unknown, const GenericOutput extends GenericItem>(iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>, predicate: (item: GenericItem, params: AsyncFilterParams) => item is GenericOutput): AsyncGenerator<GenericOutput, unknown, unknown>;
export declare function asyncFilter<const GenericItem extends unknown>(predicate: (item: GenericItem, params: AsyncFilterParams) => boolean): (iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>) => AsyncGenerator<GenericItem, unknown, unknown>;
export declare function asyncFilter<const GenericItem extends unknown>(iterator: Iterable<GenericItem> | AsyncIterable<GenericItem>, predicate: (item: GenericItem, params: AsyncFilterParams) => boolean): AsyncGenerator<GenericItem, unknown, unknown>;
