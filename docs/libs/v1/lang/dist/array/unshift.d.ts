import { ReapplyCompatiblesConstraints } from './constraints';
type UnshiftOutput<GenericArray extends readonly unknown[], GenericValue extends unknown, GenericValuesRest extends readonly unknown[] = []> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly (GenericValue | GenericValuesRest[number] | GenericArray[number])[], "minElements"> : never;
export declare function unshift<GenericArray extends readonly unknown[], const GenericValue extends unknown>(value: GenericValue): (array: GenericArray) => UnshiftOutput<GenericArray, GenericValue>;
export declare function unshift<GenericArray extends readonly unknown[], const GenericValue extends unknown, GenericValuesRest extends readonly unknown[]>(array: GenericArray, value: GenericValue, ...valuesRest: GenericValuesRest): UnshiftOutput<GenericArray, GenericValue, GenericValuesRest>;
export {};
