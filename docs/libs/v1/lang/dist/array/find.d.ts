export interface FindPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function find<GenericArray extends readonly unknown[], GenericOutput extends GenericArray[number]>(predicate: (element: GenericArray[number], params: FindPredicateFunctionParams<GenericArray>) => element is GenericOutput): (array: GenericArray) => GenericOutput | undefined;
export declare function find<GenericArray extends readonly unknown[], GenericOutput extends GenericArray[number]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindPredicateFunctionParams<GenericArray>) => element is GenericOutput): GenericOutput | undefined;
export declare function find<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: FindPredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => GenericArray[number] | undefined;
export declare function find<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindPredicateFunctionParams<GenericArray>) => boolean): GenericArray[number] | undefined;
