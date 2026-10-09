import { ReapplyCompatiblesConstraints } from './constraints';
type CopyWithinOutput<GenericArray extends readonly unknown[]> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericArray[number][]> : never;
export declare function copyWithin<GenericArray extends readonly unknown[]>(target: number, start: number, end?: number): (array: GenericArray) => CopyWithinOutput<GenericArray>;
export declare function copyWithin<GenericArray extends readonly unknown[]>(array: GenericArray, target: number, start: number, end?: number): CopyWithinOutput<GenericArray>;
export {};
