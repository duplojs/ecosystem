import { ReapplyCompatiblesConstraints } from './constraints';
export interface FilterPredicateFunctionParams<GenericArray extends readonly unknown[] = readonly unknown[]> {
    index: number;
    self: GenericArray;
}
type FilterOutput<GenericArray extends readonly unknown[], GenericElement extends GenericArray[number] = GenericArray[number]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericElement[], "maxElements"> : never;
export declare function filter<GenericArray extends readonly unknown[], GenericElement extends GenericArray[number]>(predicate: (element: GenericArray[number], params: FilterPredicateFunctionParams<GenericArray>) => element is GenericElement): (array: GenericArray) => FilterOutput<GenericArray, GenericElement>;
export declare function filter<GenericArray extends readonly unknown[], GenericElement extends GenericArray[number]>(array: GenericArray, predicate: (element: GenericArray[number], params: FilterPredicateFunctionParams<GenericArray>) => element is GenericElement): FilterOutput<GenericArray, GenericElement>;
export declare function filter<GenericArray extends readonly unknown[]>(predicate: (element: GenericArray[number], params: FilterPredicateFunctionParams<GenericArray>) => boolean): (array: GenericArray) => FilterOutput<GenericArray>;
export declare function filter<GenericArray extends readonly unknown[]>(array: GenericArray, predicate: (element: GenericArray[number], params: FilterPredicateFunctionParams<GenericArray>) => boolean): FilterOutput<GenericArray>;
export {};
