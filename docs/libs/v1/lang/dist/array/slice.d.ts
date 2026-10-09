export declare function slice<GenericArray extends readonly unknown[]>(start?: number, end?: number): (array: GenericArray) => GenericArray[number][];
export declare function slice<GenericArray extends readonly unknown[]>(array: GenericArray, start?: number, end?: number): GenericArray[number][];
