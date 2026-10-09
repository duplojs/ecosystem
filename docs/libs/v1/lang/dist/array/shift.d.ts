import { ReapplyCompatiblesConstraints } from './constraints';
type ShiftOutput<GenericArray extends readonly unknown[]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][], "maxElements"> : never;
export declare function shift<GenericArray extends readonly unknown[]>(array: GenericArray): ShiftOutput<GenericArray>;
export {};
