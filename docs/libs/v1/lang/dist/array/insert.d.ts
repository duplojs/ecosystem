import { ReapplyCompatiblesConstraints } from './constraints';
type InsertOutput<GenericArray extends readonly unknown[], GenericValue extends unknown> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericValue)[], "minElements"> : never;
export declare function insert<const GenericValue extends unknown, GenericArray extends readonly unknown[]>(array: GenericArray): (value: GenericValue) => InsertOutput<GenericArray, GenericValue>;
export declare function insert<const GenericValue extends unknown, GenericArray extends readonly unknown[]>(value: GenericValue, array: GenericArray): InsertOutput<GenericArray, GenericValue>;
export {};
