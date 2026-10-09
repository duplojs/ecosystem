export interface MapTheFunctionParams<GenericItem extends unknown = unknown> {
    index: number;
    self: Iterable<GenericItem>;
}
export declare function map<const GenericItem extends unknown, const GenericOutput extends unknown>(theFunction: (item: GenericItem, params: MapTheFunctionParams<GenericItem>) => GenericOutput): (iterator: Iterable<GenericItem>) => Generator<GenericOutput, unknown, unknown>;
export declare function map<const GenericItem extends unknown, const GenericOutput extends unknown>(iterator: Iterable<GenericItem>, theFunction: (item: GenericItem, params: MapTheFunctionParams<GenericItem>) => GenericOutput): Generator<GenericOutput, unknown, unknown>;
