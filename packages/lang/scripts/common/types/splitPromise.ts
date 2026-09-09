export type SplitPromise<
	GenericValue extends unknown,
> = GenericValue extends Promise<infer InferredValue>
	? InferredValue extends unknown
		? Promise<InferredValue>
		: never
	: GenericValue;
