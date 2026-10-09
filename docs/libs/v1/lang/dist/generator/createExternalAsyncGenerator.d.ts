export declare function createExternalAsyncGenerator<GenericItem extends unknown>(): {
    asyncGenerator: AsyncGenerator<Awaited<GenericItem>, void, unknown>;
    next: (item: GenericItem) => undefined;
    exit: () => undefined;
};
