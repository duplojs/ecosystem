import { ReapplyCompatiblesConstraints } from './constraints';
export interface MapTheFunctionParams<GenericInputArray extends readonly unknown[]> {
    index: number;
    self: GenericInputArray;
}
type MapOutput<GenericArray extends readonly unknown[], GenericOutput extends unknown> = GenericArray extends unknown ? ReapplyCompatiblesConstraints<GenericArray, readonly GenericOutput[]> : never;
export declare function map<GenericArray extends readonly unknown[], GenericOutput extends unknown>(theFunction: (element: GenericArray[number], params: MapTheFunctionParams<GenericArray>) => GenericOutput): (array: GenericArray) => MapOutput<GenericArray, GenericOutput>;
export declare function map<GenericArray extends readonly unknown[], GenericOutput extends unknown>(array: GenericArray, theFunction: (element: GenericArray[number], params: MapTheFunctionParams<GenericArray>) => GenericOutput): MapOutput<GenericArray, GenericOutput>;
export {};
