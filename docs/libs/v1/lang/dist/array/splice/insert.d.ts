import { ReapplyCompatiblesConstraints } from '../constraints';
type SpliceInsertOutput<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericElements[number])[], "minElements"> : never;
export declare function spliceInsert<GenericElements extends readonly unknown[]>(indexFrom: number, elements: GenericElements): <GenericArray extends readonly unknown[]>(array: GenericArray) => SpliceInsertOutput<GenericArray, GenericElements>;
export declare function spliceInsert<GenericArray extends readonly unknown[], GenericElements extends readonly unknown[]>(array: GenericArray, indexFrom: number, elements: GenericElements): SpliceInsertOutput<GenericArray, GenericElements>;
export {};
