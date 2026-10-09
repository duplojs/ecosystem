export interface FindLastIndexPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function findLastIndex<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: FindLastIndexPredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => number | undefined;
export declare function findLastIndex<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindLastIndexPredicateFunctionParams) => boolean): number | undefined;
