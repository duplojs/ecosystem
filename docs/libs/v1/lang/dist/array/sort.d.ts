import { ReapplyCompatiblesConstraints } from './constraints';
type SortOutput<GenericArray extends readonly unknown[], GenericElement extends GenericArray[number]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericElement[]> : never;
export declare function sort<GenericArray extends readonly unknown[], GenericElement extends GenericArray[number] = GenericArray[number]>(compareFunction: (first: GenericElement, second: GenericElement) => number): (array: GenericArray) => SortOutput<GenericArray, GenericElement>;
export declare function sort<GenericArray extends readonly unknown[], GenericElement extends GenericArray[number] = GenericArray[number]>(array: GenericArray, compareFunction: (first: GenericElement, second: GenericElement) => number): SortOutput<GenericArray, GenericElement>;
export {};
