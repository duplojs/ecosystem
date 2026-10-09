import { ReapplyCompatiblesConstraints } from '../constraints';
type SpliceDeleteOutput<GenericArray extends readonly unknown[]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][], "maxElements"> : never;
export declare function spliceDelete(indexTo: number, deleteCount: number): <GenericArray extends readonly unknown[]>(array: GenericArray) => SpliceDeleteOutput<GenericArray>;
export declare function spliceDelete<GenericArray extends readonly unknown[]>(array: GenericArray, indexTo: number, deleteCount: number): SpliceDeleteOutput<GenericArray>;
export {};
