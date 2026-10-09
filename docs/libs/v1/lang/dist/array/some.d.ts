export interface SomePredicateFunctionParams<GenericInputArray extends readonly unknown[]> {
    index: number;
    self: GenericInputArray;
}
export declare function some<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: SomePredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => boolean;
export declare function some<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: SomePredicateFunctionParams<GenericArray>) => boolean): boolean;
