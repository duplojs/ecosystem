export type GetResult<
	GenericGenerator extends (
		| Iterable<unknown>
		| AsyncIterable<unknown>
	),
> = GenericGenerator extends Iterable<any, infer InferredResult>
	? InferredResult
	: GenericGenerator extends AsyncIterable<any, infer InferredResult>
		? InferredResult
		: never;
