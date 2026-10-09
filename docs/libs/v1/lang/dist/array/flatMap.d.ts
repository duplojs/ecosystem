export interface FlatMapTheFunctionParams<GenericArray extends readonly unknown[]> {
    index: number;
    self: GenericArray;
}
export declare function flatMap<GenericArray extends readonly unknown[], GenericOutput extends unknown>(theFunction: (element: GenericArray[number], params: FlatMapTheFunctionParams<GenericArray>) => GenericOutput): (array: GenericArray) => readonly FlatArray<GenericOutput, 1>[];
export declare function flatMap<GenericArray extends readonly unknown[], GenericOutput extends unknown>(array: GenericArray, theFunction: (element: GenericArray[number], params: FlatMapTheFunctionParams<GenericArray>) => GenericOutput): readonly FlatArray<GenericOutput, 1>[];
