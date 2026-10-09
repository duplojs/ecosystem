import { ReapplyCompatiblesConstraints } from '../constraints';
export interface FindAndSpliceDeletePredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
type FindAndSpliceDeleteOutput<GenericArray extends readonly unknown[]> = GenericArray extends unknown ? Extract<ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][], "maxElements"> | undefined, any> : never;
export declare function findAndSpliceDelete<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: FindAndSpliceDeletePredicateFunctionParams<GenericArray>) => boolean, deleteCount: number): (array: GenericArray) => Extract<FindAndSpliceDeleteOutput<GenericArray>, any>;
export declare function findAndSpliceDelete<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FindAndSpliceDeletePredicateFunctionParams<GenericArray>) => boolean, deleteCount: number): Extract<FindAndSpliceDeleteOutput<GenericArray>, any>;
export {};
