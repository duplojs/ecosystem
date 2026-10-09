export interface EveryPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function every<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: EveryPredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => boolean;
export declare function every<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: EveryPredicateFunctionParams<GenericArray>) => boolean): boolean;
