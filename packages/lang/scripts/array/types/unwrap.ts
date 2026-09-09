export type Unwrap<
	GenericValue extends unknown,
> = GenericValue extends readonly (infer InferredElement)[]
	? InferredElement
	: GenericValue;
