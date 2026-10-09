import { ReapplyCompatiblesConstraints } from './constraints';
type ReverseOutput<GenericArray extends readonly unknown[]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][]> : never;
export declare function reverse<GenericArray extends readonly unknown[]>(array: GenericArray): ReverseOutput<GenericArray>;
export {};
