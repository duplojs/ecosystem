export interface FindLastPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function findLast<GenericArray extends readonly unknown[], GenericOutput extends GenericArray[number]>(predicate: (element: GenericArray[number], params: FindLastPredicateFunctionParams<GenericArray>) => element is GenericOutput): (array: GenericArray) => GenericOutput | undefined;
export declare function findLast<GenericArray extends readonly unknown[], GenericOutput extends GenericArray[number]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindLastPredicateFunctionParams<GenericArray>) => element is GenericOutput): GenericOutput | undefined;
export declare function findLast<GenericArray extends readonly unknown[], GenericOutput extends GenericArray[number]>(predicate: (element: GenericArray[number], params: FindLastPredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => GenericOutput | undefined;
export declare function findLast<GenericArray extends readonly unknown[], GenericOutput extends GenericArray[number]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindLastPredicateFunctionParams<GenericArray>) => boolean): GenericOutput | undefined;
