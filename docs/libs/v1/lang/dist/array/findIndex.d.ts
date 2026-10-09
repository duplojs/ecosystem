export interface FindIndexPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function findIndex<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: FindIndexPredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => number | undefined;
export declare function findIndex<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindIndexPredicateFunctionParams<GenericArray>) => boolean): number | undefined;
