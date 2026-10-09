export interface AsyncMapParams {
    index: number;
}
export declare function asyncMap<const GenericItem extends unknown, const GenericOutput extends unknown>(theFunction: (item: GenericItem, params: AsyncMapParams) => GenericOutput): (iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>) => AsyncGenerator<Awaited<GenericOutput>, unknown, unknown>;
export declare function asyncMap<const GenericItem extends unknown, const GenericOutput extends unknown>(iterator: AsyncIterable<GenericItem> | Iterable<GenericItem>, theFunction: (item: GenericItem, params: AsyncMapParams) => GenericOutput): AsyncGenerator<Awaited<GenericOutput>, unknown, unknown>;
