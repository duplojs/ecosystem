import { ReapplyCompatiblesConstraints } from '../constraints';
export interface FindAndSpliceInsertPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
type FindAndSpliceInsertOutput<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]> = GenericArray extends unknown ? (ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericElements[number])[], "minElements"> | undefined) : never;
export declare function findAndSpliceInsert<GenericElements extends readonly unknown[]>(predicate: (element: unknown, params: FindAndSpliceInsertPredicateFunctionParams) => boolean, elements: GenericElements): <GenericArray extends readonly unknown[]>(array: GenericArray) => Extract<FindAndSpliceInsertOutput<GenericArray, GenericElements>, any>;
export declare function findAndSpliceInsert<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindAndSpliceInsertPredicateFunctionParams<GenericArray>) => boolean, elements: GenericElements): Extract<FindAndSpliceInsertOutput<GenericArray, GenericElements>, any>;
export {};
