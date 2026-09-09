export type Map<
	GenericArray extends readonly unknown[],
	GenericOutput extends unknown,
> = GenericArray extends readonly []
	? []
	: GenericArray extends readonly [infer _InferredFirst, ...infer InferredRest]
		? Map<InferredRest, GenericOutput> extends infer InferredResult extends readonly any[]
			? [GenericOutput, ...InferredResult]
			: never
		: GenericOutput[];
