import { ReapplyCompatiblesConstraints } from '../constraints';
type FillOutput<GenericArray extends readonly unknown[], GenericValue extends unknown> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly (GenericArray[number] | GenericValue)[]> : never;
export declare function fill<GenericArray extends readonly unknown[], const GenericValue extends unknown>(value: GenericValue, start: number, end: number): (array: GenericArray) => FillOutput<GenericArray, GenericValue>;
export declare function fill<GenericArray extends readonly unknown[], const GenericValue extends unknown>(array: GenericArray, value: GenericValue, start: number, end: number): FillOutput<GenericArray, GenericValue>;
export {};
