type Enumerable = ArrayLike<unknown> | Iterable<unknown> | AsyncIterable<unknown>;
type FromOutput<GenericEnumerable extends Enumerable> = GenericEnumerable extends AsyncIterable<infer InferredValue> ? Promise<readonly InferredValue[]> : GenericEnumerable extends Iterable<infer InferredValue> ? readonly InferredValue[] : GenericEnumerable extends ArrayLike<infer InferredValue> ? readonly InferredValue[] : never;
export declare function from<const GenericEnumerable extends Enumerable>(input: GenericEnumerable): FromOutput<GenericEnumerable>;
export {};
