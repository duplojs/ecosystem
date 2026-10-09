export interface FindAndSpliceReplacePredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function findAndSpliceReplace<GenericElements extends readonly unknown[]>(predicate: (element: unknown, params: FindAndSpliceReplacePredicateFunctionParams) => boolean, elements: GenericElements): <GenericArray extends readonly unknown[]>(array: GenericArray) => (GenericArray[number] | GenericElements[number])[] | undefined;
export declare function findAndSpliceReplace<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindAndSpliceReplacePredicateFunctionParams<GenericArray>) => boolean, elements: GenericElements): (GenericArray[number] | GenericElements[number])[] | undefined;
