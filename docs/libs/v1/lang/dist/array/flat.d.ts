export declare function flat<const GenericArray extends readonly unknown[], const Depth extends number = 1>(array: GenericArray, depth?: Depth): readonly FlatArray<GenericArray, Depth>[];
