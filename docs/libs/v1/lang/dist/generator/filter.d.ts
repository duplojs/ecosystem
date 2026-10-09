export interface FilterParams<GenericItem extends unknown = unknown> {
    index: number;
    self: Iterable<GenericItem>;
}
export declare function filter<const GenericItem extends unknown, const GenericOutput extends GenericItem>(predicate: (item: GenericItem, params: FilterParams<GenericItem>) => item is GenericOutput): (iterator: Iterable<GenericItem>) => Generator<GenericOutput, unknown, unknown>;
export declare function filter<const GenericItem extends unknown, const GenericOutput extends GenericItem>(iterator: Iterable<GenericItem>, predicate: (item: GenericItem, params: FilterParams<GenericItem>) => item is GenericOutput): Generator<GenericOutput, unknown, unknown>;
export declare function filter<const GenericItem extends unknown>(predicate: (item: GenericItem, params: FilterParams<GenericItem>) => boolean): (iterator: Iterable<GenericItem>) => Generator<GenericItem, unknown, unknown>;
export declare function filter<const GenericItem extends unknown>(iterator: Iterable<GenericItem>, predicate: (item: GenericItem, params: FilterParams<GenericItem>) => boolean): Generator<GenericItem, unknown, unknown>;
