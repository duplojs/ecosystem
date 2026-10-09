export declare function concat<const GenericItem extends unknown>(items: Iterable<GenericItem>): (iterator: Iterable<GenericItem>) => Generator<GenericItem, unknown, unknown>;
export declare function concat<const GenericItem extends unknown>(iterator: Iterable<GenericItem>, items: Iterable<GenericItem>, ...itemsRest: Iterable<GenericItem>[]): Generator<GenericItem, unknown, unknown>;
